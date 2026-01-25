const AdminService = require('./admin.service');

class AdminController {
  async getPending(req, res) {
    try {
      // In real app, only role === 'ADMIN' can access
      const events = await AdminService.getPendingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async approve(req, res) {
    try {
      const event = await AdminService.updateEventStatus(req.params.id, 'PUBLISHED');
      res.json({ message: 'Event published', event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async reject(req, res) {
    try {
      const event = await AdminService.updateEventStatus(req.params.id, 'REJECTED');
      res.json({ message: 'Event rejected', event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAndPublish(req, res) {
    try {
      const event = await AdminService.editAndApproveEvent(req.params.id, req.body);
      res.json({ message: 'Event updated and published', event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AdminController();
