import fs from 'fs';
import path from 'path';

const services = [
    'api-gateway', 'auth-service', 'user-service', 'course-service',
    'content-service', 'video-service', 'enrollment-service',
    'payment-service', 'progress-service', 'review-service',
    'notification-service'
];

services.forEach((service, index) => {
    const projectPath = path.join(process.cwd(), service, 'project.json');
    if (fs.existsSync(projectPath)) {
        const project = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
        if (project.targets && project.targets.serve && project.targets.serve.options) {
            project.targets.serve.options.inspect = false;
            // Also add a unique port just in case nx:node ignores inspect: false
            // for the default debugger binding.
            project.targets.serve.options.port = 9230 + index;
        }
        fs.writeFileSync(projectPath, JSON.stringify(project, null, 2));
        console.log(`Updated ${service}/project.json with unique inspect port ${9230 + index}`);
    }
});
