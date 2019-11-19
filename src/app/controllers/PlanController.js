import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const { page = 1, quantity = 20 } = req.query;

    const plans = await Plan.findAll({
      limit: quantity,
      offset: (page - 1) * quantity,
      order: ['price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }
}

export default new PlanController();
