import { subDays } from 'date-fns';
import Checkins from '../models/Checkins';
import Students from '../models/Students';

const { Op } = require('sequelize');

class CheckinsController {
  async index(req, res) {
    const checkins = await Checkins.findAll({
      where: { student_id: req.params.id },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Students.findOne({
      where: { id },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student not exist' });
    }

    const date_Subtract = subDays(new Date(), 7);

    const checkins = await Checkins.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.gte]: date_Subtract,
        },
      },
    });

    if (checkins.length >= 5) {
      return res
        .status(401)
        .json({ error: 'You have exceeded the check-ins limit per week.' });
    }

    const checkin = await Checkins.create({
      student_id: id,
    });

    return res.json(checkin);
  }
}

export default new CheckinsController();
