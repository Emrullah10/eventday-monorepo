const AggregatorService = require('./aggregator.service');

class AggregatorController {
  async triggerSync(req, res) {
    try {
      const results = await AggregatorService.syncAll();
      res.json({
        message: 'Sync completed successfully',
        results
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AggregatorController();
