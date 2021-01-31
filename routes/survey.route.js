const express = require("express");
const mongoose = require("mongoose");

const Survey = mongoose.model("Survey");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const mailer = require("../services/mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const router = express.Router();

router.get('/', requireLogin , async (req, res) => {
  const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false });
  res.send(surveys);
});

router.get("/:surveyId/:choices", async (req, res) => {
  //do some fun logic here :)

  const surveyId = req.params.surveyId;
  const choice = req.params.choices;

  try {
    const survey = await Survey.findById(surveyId);
    if (survey) {
      if (choice.toString() === 'yes') {
        survey.yes += 1;
      } else {
        survey.no += 1;
      }
      if (survey.save()) {
        res.send('<br><br><h1 style="text-align:center;">Thank you for participating =)</h1>');
      }
    }
  } catch (err) {
    res.send('<br><br><h1 style="text-align:center;">Survey not found =(<h1>');
    throw new Error(`Survey not found. ${err}`);
  }
  res.send('<br><br><h1 style="text-align:center;">Survey not found =(<h1>');
}); // domain/api/surveys/23526tqdasfawraa/yes

router.post("/", requireLogin, requireCredits, async (req, res) => {
  const { title, subject, body, recipients } = req.body;
  console.log('b4 save: ', recipients);
  const survey = new Survey({
    title,
    subject,
    body,
    recipients: recipients.split(",").map((email) => ({ email: email.trim() })),
    _user: req.user.id,
    dateSent: Date.now(),
  });

  try {
    //helper function to blast out email!
    await mailer(survey, surveyTemplate(survey));
    await survey.save();

    req.user.credits -= 1;
    const user = req.user.save();

    res.send(user);
  } catch (err) {
    res.status(422).send(err);
  }
});

module.exports = router;
