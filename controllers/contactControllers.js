const expressAsyncHandler = require('express-async-handler');
const contactModel = require('../models/contactModel');

const getAllContacts = expressAsyncHandler(async (req, res) => {
  const contacts = await contactModel.find({ user_id: req.userId });
  res.json(contacts);
});

const addContact = expressAsyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Name, Phone and Email is needed to create a new contact');
  }
  const createdContact = await contactModel.create({
    name,
    email,
    phone,
    user_id: req.userId,
  });
  res.status(201).json(createdContact);
});

const updateContact = expressAsyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const contactId = await contactModel.findById(req?.params?.id);

  if (!contactId) {
    throw new Error('could not find the contact ID');
  }

  const newValues = {
    name,
    email,
    phone,
  };

  if (contactId?.user_id?.toString() !== req?.userId) {
    res.status(403);
    throw new Error("permission denied to update other user's contacts");
  }

  const updatedContact = await contactModel.findByIdAndUpdate(
    req?.params?.id,
    newValues,
    { new: true }
  );

  res.json(updatedContact);
});

const deleteContact = expressAsyncHandler(async (req, res) => {
  const contactId = await contactModel.findById(req?.params?.id);

  if (!contactId) {
    throw new Error('could not find the contact ID');
  }

  if (contactId?.user_id?.toString() !== req?.userId) {
    res.status(403);
    throw new Error("permission denied to delete other user's contacts");
  }

  const deletedDocument = await contactModel.findByIdAndRemove(req?.params?.id);

  if (!deletedDocument) {
    return res.status(404).json({ message: 'Document not found' });
  }

  res.status(200).json({ message: 'Document deleted successfully' });
});

const getContactById = expressAsyncHandler(async (req, res) => {
  const id = req?.params?.id;

  const contactInfo = await contactModel.findById(id);

  if (contactInfo) {
    res.status(200).json(contactInfo);
  } else {
    res.status(400).json({ message: 'Could not find the contact ID' });
  }
});

module.exports = {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactById,
};
