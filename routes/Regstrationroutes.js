const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const asyncHandler = require('../utiles/asynchandller');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
} = require('../controllers/RegstrationContrllers');

router.use(requireAuth);

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Register for an event
 *     tags:
 *       - Registrations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Already registered or event full
 *       401:
 *         description: Unauthorized
 */
router.post('/', registerForEvent);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     summary: Get my registrations
 *     tags:
 *       - Registrations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 *       401:
 *         description: Unauthorized
 */
router.get('/my', getMyRegistrations);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel registration
 *     tags:
 *       - Registrations
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
 *         description: Registration cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Registration not found
 */
router.delete('/:id', cancelRegistration);

module.exports = router;