const db = require('../config/database');

const getAllSchedules = async (req, res) => {
  try {
    const [schedules] = await db.query(`
      SELECT
        s.*,
        p.title as propertyTitle,
        p.address as propertyAddress,
        u.full_name as userName,
        u.email as userEmail
      FROM schedules s
      JOIN properties p ON s.property_id = p.id
      JOIN users u ON s.user_id = u.id
      ORDER BY s.visit_date DESC, s.visit_time DESC
    `);

    res.json({ schedules });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserSchedules = async (req, res) => {
  try {
    const userId = req.user.id;

    const [schedules] = await db.query(`
      SELECT
        s.*,
        p.title as propertyTitle,
        p.address as propertyAddress,
        p.city as propertyCity
      FROM schedules s
      JOIN properties p ON s.property_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.visit_date DESC, s.visit_time DESC
    `, [userId]);

    res.json({ schedules });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSchedule = async (req, res) => {
  try {
    const { property_id, visit_date, visit_time, message } = req.body;
    const userId = req.user.id;

    if (!property_id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    if (!visit_date || !visit_time) {
      return res.status(400).json({ message: 'Visit date and time are required' });
    }

    const [properties] = await db.query('SELECT id, agent_id FROM properties WHERE id = ?', [property_id]);

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        message: 'Property not found',
        property_id: property_id
      });
    }

    const agentId = properties[0].agent_id;

    if (!agentId) {
      return res.status(400).json({ message: 'Property has no assigned agent' });
    }

    const [result] = await db.query(
      'INSERT INTO schedules (property_id, user_id, agent_id, visit_date, visit_time, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [property_id, userId, agentId, visit_date, visit_time, message || null, 'pending']
    );

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: {
        id: result.insertId,
        property_id,
        user_id: userId,
        agent_id: agentId,
        visit_date,
        visit_time,
        message,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Schedule creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await db.query('UPDATE schedules SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Schedule status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM schedules WHERE id = ?', [id]);

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllSchedules,
  getUserSchedules,
  createSchedule,
  updateScheduleStatus,
  deleteSchedule
};
