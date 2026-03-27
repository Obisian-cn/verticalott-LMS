import { QueryInterface, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Create videos table
      await queryInterface.createTable(
        "videos",
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          playback_id: {
            type: DataTypes.STRING,
            allowNull: true
          },
          video_url: {
            type: DataTypes.STRING,
            allowNull: true
          },
          duration: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          instructor_id: {
            type: DataTypes.UUID,
            allowNull: false
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
          }
        },
        { transaction }
      );

      // 2. Add new columns to lessons table
      await queryInterface.addColumn(
        "lessons",
        "resource_pdf_url",
        {
          type: DataTypes.STRING,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "lessons",
        "end_goal",
        {
          type: DataTypes.TEXT,
          allowNull: true
        },
        { transaction }
      );

      // 3. Create user_video_progress table
      await queryInterface.createTable(
        "user_video_progress",
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
          },
          user_id: {
            type: DataTypes.UUID,
            allowNull: false
          },
          video_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: "videos",
              key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
          completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
          },
          progress_seconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
          }
        },
        { transaction }
      );

      // 4. Data Migration: Move existing distinct videoUrl/videoPlaybackId pairs to videos table.
      // We assume an admin/instructor created them, but we don't have instructor_id in lessons, so we'll 
      // fetch the first admin/instructor or create a dummy UUID for instructor_id if needed, or query it through section -> course -> instructor.
      
      const [lessons] = await queryInterface.sequelize.query(
        `SELECT l.id as "lessonId", l.video_url as "videoUrl", l.video_playback_id as "playbackId", l.title as "title", l.duration as "duration", c.instructor_id as "instructorId" 
         FROM lessons l
         LEFT JOIN sections s ON l.section_id = s.id
         LEFT JOIN courses c ON s.course_id = c.id
         WHERE l.video_url IS NOT NULL OR l.video_playback_id IS NOT NULL;`,
        { transaction }
      );

      if (lessons && lessons.length > 0) {
        // Find distinct videos based on URL to avoid duplicates.
        const videoMap = new Map();

        for (const lesson of lessons as any[]) {
          const videoUrlKey = lesson.videoUrl || lesson.playbackId;
          if (!videoMap.has(videoUrlKey)) {
            const videoId = uuidv4();
            videoMap.set(videoUrlKey, videoId);
            
            // Default UUID if instructorId is missing (e.g., disconnected data)
            const fallbackInstructorId = lesson.instructorId || uuidv4();

            await queryInterface.sequelize.query(
              `INSERT INTO videos (id, title, video_url, playback_id, duration, instructor_id, created_at, updated_at) 
               VALUES (:id, :title, :videoUrl, :playbackId, :duration, :instructorId, NOW(), NOW())`,
              {
                replacements: {
                  id: videoId,
                  title: lesson.title,
                  videoUrl: lesson.videoUrl || null,
                  playbackId: lesson.playbackId || null,
                  duration: lesson.duration || null,
                  instructorId: fallbackInstructorId
                },
                transaction
              }
            );
          }

          // Update lesson's video_id
          const existingVideoId = videoMap.get(videoUrlKey);
          await queryInterface.sequelize.query(
            `UPDATE lessons SET video_id = :videoId WHERE id = :lessonId`,
            {
              replacements: { videoId: existingVideoId, lessonId: lesson.lessonId },
              transaction
            }
          );
        }
      }

      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      console.warn("Migration warning:", err.message);
      throw err;
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("user_video_progress", { transaction });
      await queryInterface.removeColumn("lessons", "resource_pdf_url", { transaction });
      await queryInterface.removeColumn("lessons", "end_goal", { transaction });
      await queryInterface.dropTable("videos", { transaction });
      await transaction.commit();
    } catch (err: any) {
      await transaction.rollback();
      throw err;
    }
  }
};
