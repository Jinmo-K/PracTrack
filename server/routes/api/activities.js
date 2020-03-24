const router = require('express').Router();
const passport = require("passport");

const Activity = require('../../models/Activity.model');
const Log = require('../../models/Log.model');

// Load async wrapper function
const handleAsyncError = require('../../middleware/handleAsyncError');


/**
 * @route GET /api/activities
 * @desc Retrieves list of all activities
 * @access Admin
 */
router.get('/', passport.authenticate('admin', { session: false }), handleAsyncError(async (req, res) => {
  res.json(await Activity.find({}));
}));


/**
 * @route GET /api/activities/{activityId}
 * @desc Retrieve specified activity
 * @access Private
 */
router.get('/:activityId', passport.authenticate('activityOwner', { session: false }), handleAsyncError(async (req, res) => {
  res.json(await Activity.findById(req.params.activityId));
}));


/**
 * @route PUT /api/activities/{activityId}
 * @desc Update specified activity
 * @access Private
 */
router.put('/:activityId', passport.authenticate('activityOwner', { session: false }), handleAsyncError(async (req, res) => {
  const updatedActivity = await Activity.findByIdAndUpdate(
                            req.params.activityId,
                            { ...req.body },
                            { new: true }
                          );
  res.json(updatedActivity);
}));


/*
* =============================================================
*   Logs
* =============================================================
*/

/**
 * @route GET /api/activities/{activityId}/logs
 * @desc Get all logs associated with activity
 * @access Private
 */
router.get('/:activityId/logs', passport.authenticate('activityOwner', { session: false }), handleAsyncError(async (req, res) => {
  const activity = await Activity.findById(req.params.activityId);
  let logs = [];
  for (logId of activity.logs) {
    logs.push(await Log.findById(logId));
  }
  res.json(logs);
}));


/**
 * @route POST /api/activities/{activityId}/logs
 * @desc Create a new log for an activity
 * @access Private
 */
router.post('/:activityId/logs', passport.authenticate('activityOwner', { session: false }), handleAsyncError(async (req, res) => {
  const newLog = new Log(req.body);

  await newLog.save();

  //Add reference to associated activity
  await Activity.findOneAndUpdate(
    { _id: req.params.activityId },
    {
      $push: { logs: newLog._id },
      $inc: { totalDuration: newLog.duration },
      $set: { updated: Date.now() },
    },
    { new: true },
  );
  res.json(newLog);
}));


/**
 * @route DELETE /api/activities/{activityId}/logs/{logId}
 * @desc Delete log from activity
 * @access Private
 */
router.delete('/:activityId/logs/:logId', passport.authenticate('activityOwner', { session: false }), handleAsyncError(async (req, res) => {
  const logId = req.params.logId;
  const activityId = req.params.activityId;
  const log = await Log.findById(logId);
  await log.remove();

  // Remove reference from associated activity
  await Activity.findOneAndUpdate(
    { _id: activityId },
    {
      $pull: { logs: logId },
      $inc: { totalDuration: -log.duration },
      $set: { updated: Date.now() },
    }
  );
  res.json(`Success: deleted activity ${logId}`);
}));


/**
 * @route PUT /api/activities/{activityId}/logs/{logId}
 * @desc Update specified log
 * @access Private
 */
router.put('/:activityId/logs/:logId', passport.authenticate('activityOwner', { session: false }), handleAsyncError(async (req, res) => {
  const logId = req.params.logId;
  const updatedLog = await Log.findByIdAndUpdate(
                        logId,
                        { ...req.body },
                        { new: true },
                      );
  res.json(updatedLog);
}));


module.exports = router;