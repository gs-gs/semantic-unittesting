import { useCallback, useEffect, useReducer } from "react";

import { Assessment, Job, Response } from "@/services/types";

import useWebSocket, { ReadyState } from "react-use-websocket";

type JobState = {
  jobId: string;
  // job: Job;
  responses: Response[];
  assessments: Assessment[];
};

type JobCreateEvent = {
  type: "JOB_CREATE";
  id: string;
  job: Job;
};

function isJobCreateEvent(data: unknown): data is JobCreateEvent {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "JOB_CREATE"
  );
}

type JobFinishEvent = {
  type: "JOB_FINISH";
  id: string;
  finishedOn: string;
};

function isJobFinishEvent(data: unknown): data is JobFinishEvent {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "JOB_FINISH"
  );
}

type ResponseAddEvent = {
  type: "RESPONSE_ADD";
  id: string;
  response: Response;
};

function isResponseAddEvent(data: unknown): data is ResponseAddEvent {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "RESPONSE_ADD"
  );
}

type AssessmentAddEvent = {
  type: "ASSESSMENT_ADD";
  id: string;
  assessment: Assessment;
};

function isAssessmentAddEvent(data: unknown): data is AssessmentAddEvent {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "ASSESSMENT_ADD"
  );
}

type JobCreateAction = JobCreateEvent;
type JobFinishAction = JobFinishEvent;
type ResponseAddAction = ResponseAddEvent;
type AssessmentAddAction = AssessmentAddEvent;

type ActionTypes =
  | JobCreateAction
  | JobFinishAction
  | ResponseAddAction
  | AssessmentAddAction;

function addResponse(state: JobState, action: ResponseAddAction) {
  return {
    ...state,
    responses: [...state.responses, action.response],
  };
}

function addAssessment(state: JobState, action: AssessmentAddAction) {
  return {
    ...state,
    assessments: [...state.assessments, action.assessment],
  };
}

function reducer(state: JobState, action: ActionTypes): JobState {
  switch (action.type) {
    case "RESPONSE_ADD": {
      return addResponse(state, action);
    }
    case "ASSESSMENT_ADD": {
      return addAssessment(state, action);
    }
    default:
      return state;
  }
}

export function useJobStream({ jobId }: { jobId: string }) {
  const [state, dispatchMessages] = useReducer(reducer, {
    jobId,
    responses: [],
    assessments: [],
  });
  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws/jobs/${jobId}/`;

  const { lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("[socket] connected", jobId),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      if (isJobCreateEvent(lastJsonMessage)) {
        dispatchMessages(lastJsonMessage);
      }
      if (isJobFinishEvent(lastJsonMessage)) {
        dispatchMessages(lastJsonMessage);
      }
      if (isResponseAddEvent(lastJsonMessage)) {
        dispatchMessages(lastJsonMessage);
      }
      if (isAssessmentAddEvent(lastJsonMessage)) {
        dispatchMessages(lastJsonMessage);
      }
    }
  }, [lastJsonMessage]);

  return {
    connected: readyState === ReadyState.OPEN,
    jobId: state.jobId,
    responses: state.responses,
    assessments: state.assessments,
  };
}
