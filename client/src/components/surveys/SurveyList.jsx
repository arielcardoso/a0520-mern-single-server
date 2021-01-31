import React, { useEffect } from "react";
import { connect } from "react-redux";
// import * as actions from '../../actions';
import { fetchSurvey } from "../../actions";

const SurveyList = ({ surveyList, fetchSurvey }) => {
  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  return (
    <div className="container">
      {surveyList &&
        surveyList
          .reverse()
          .map((survey) => (
            <div className="card darken-1" key={survey._id}>
                <div className="card-content">
                    <span className="card-title">
                        {survey.title}
                    </span>
                    <p>{survey.body}</p>
                    <p>Sent on: {new Date(survey.dateSent).toLocaleDateString()}</p>
                </div>
                <div className="card-action">
                    <a href="#" >Yes: {survey.yes}</a>
                    <a href="#" >No: {survey.no}</a>
                </div>
            </div>
          ))}
    </div>
  );
};

const mapStateToProps = ({ surveys: { surveyList } }) => {
  return { surveyList };
};

export default connect(mapStateToProps, {fetchSurvey})(SurveyList);
