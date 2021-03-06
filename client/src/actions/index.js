import axios from "axios";

import { FETCH_USER, FETCH_SURVEYS } from "./types";

// export const fetchUser = () => {
//     return function (dipatch) {
//         axios.get('/api/auth/current_user').then((res) => {
//             dipatch({ type: FETCH_USER, payload: res.data })
//         })
//     }
// }
export const fetchUser = () => async (dipatch) => {
  const response = await axios.get("/api/auth/current_user");
  if (response) dipatch({ type: FETCH_USER, payload: response.data });
};

export const handleToken = (token) => async (dispatch) => {
  const response = await axios.post("/api/stripe", token);
  if (response) dispatch({ type: FETCH_USER, payload: response.data });
};

export const submitSurvey = (values, history) => async (dispatch) => {
  const response = await axios.post("/api/surveys", values);

  history.push("/surveys");
  dispatch({ type: FETCH_USER, payload: response.data });
};

export const fetchSurvey = () => async (dispatch) => {
  const response = await axios("/api/surveys");

  dispatch({ type: FETCH_SURVEYS, payload: response.data });
};
