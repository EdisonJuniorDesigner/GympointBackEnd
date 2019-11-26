import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

import Mail from '../../lib/Mail';

class HelpOrdersController {
  async index(req, res) {
    const { page = 1, quantity = 20 } = req.query;

    const help_orders = await HelpOrders.findAll({
      where: { answer: null },
      limit: quantity,
      offset: (page - 1) * quantity,
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(help_orders);
  }

  async store(req, res) {
    const { question } = req.body;

    const student = await Students.findOne({
      where: { id: req.params.id },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student not exist' });
    }

    const help_orders = await HelpOrders.create({
      student_id: req.params.id,
      question,
    });

    return res.json(help_orders);
  }

  async update(req, res) {
    const { answer } = req.body;

    const help_order = await HelpOrders.findOne({
      where: { id: req.params.id },
    });

    if (!help_order) {
      return res.status(401).json({ error: 'Solicited does not exist' });
    }

    const student = await Students.findOne({
      where: { id: help_order.student_id },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student not exist' });
    }

    await help_order.update({
      answer,
      answer_at: new Date(),
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta a pedido de Auxilio',
      template: 'help-order',
      context: {
        student: student.name,
        date: format(
          help_order.created_at,
          "'dia' dd 'de' MMMM', ás' H:mm'h'",
          {
            locale: pt,
          }
        ),
        question: help_order.question,
        answer: help_order.answer,
      },
    });

    return res.json(help_order);
  }
}

export default new HelpOrdersController();
