import * as Yup from 'yup';

import HelpOrders from '../models/HelpOrders';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    id: Yup.number().required(),
  });

  if (!(await schema.isValid(req.params))) {
    return res.status(400).json({ error: 'Validation failed' });
  }

  const { id } = req.params;

  const helpOrder = await HelpOrders.findByPk(id);

  if (!helpOrder) {
    return res.status(400).json({ error: 'Help orders does not exist' });
  }

  return next();
};
