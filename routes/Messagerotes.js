const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const asyncHandler = require('../utiles/asynchandller');
const router = express.Router();

const { requireAuth, requireRole } = require('../middleware/auth');
const {
  createMessage,
  getEventMessages,
  deleteMessage
} = require('../controllers/MessageControllers');

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create new message
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - eventId
 *             properties:
 *               content:
 *                 type: string
 *               eventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireAuth, createMessage);

/**
 * @swagger
 * /api/messages/event/{eventId}:
 *   get:
 *     summary: Get messages for an event
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */
router.get('/event/:eventId', requireAuth, getEventMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete message (Admin only)
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete('/:id', requireAuth, requireRole('admin'), deleteMessage);

module.exports = router;

