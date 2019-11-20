import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import StudentsController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

import authMiddleware from './app/middlewares/auth';
import checkPlanMiddleware from './app/middlewares/checkPlan';
import checkEnrollmentMiddleware from './app/middlewares/checkEnrollment';
import checkEnrollmentPlanMiddleware from './app/middlewares/checkEnrollmentPlans';
import checkEnrollmentStudentMiddleware from './app/middlewares/checkEnrollmentStudents';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', checkPlanMiddleware, PlanController.update);
routes.delete('/plans/:id', checkPlanMiddleware, PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post(
  '/enrollments',
  checkEnrollmentPlanMiddleware,
  checkEnrollmentStudentMiddleware,
  EnrollmentController.store
);
routes.put(
  '/enrollments/:id',
  checkEnrollmentMiddleware,
  checkEnrollmentPlanMiddleware,
  checkEnrollmentStudentMiddleware,
  EnrollmentController.update
);
routes.delete(
  '/enrollments/:id',
  checkEnrollmentMiddleware,
  EnrollmentController.delete
);

export default routes;
