const express = require('express');
const contactRouter = express.Router();
const {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactById,
} = require('../controllers/contactControllers');
const validateToken = require('../middleware/tokenValidator');

contactRouter.use(validateToken);

contactRouter.get('/', getAllContacts);
contactRouter.post('/', addContact);
contactRouter.put('/:id', updateContact);
contactRouter.delete('/:id', deleteContact);
contactRouter.get('/:id', getContactById);

module.exports = contactRouter;
