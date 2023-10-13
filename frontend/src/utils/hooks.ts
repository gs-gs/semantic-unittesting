import { useCallback, useEffect, useReducer } from "react";

import { Assessment, Job, Response } from "@/services/types";

import useWebSocket, { ReadyState } from "react-use-websocket";

type JobState = {
  jobId: string;
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

type JobUpdateEvent = {
  type: "JOB_UPDATE";
  id: string;
  assessments: Assessment[];
};

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
  assessments: Assessment[];
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
type JobUpdateAction = JobUpdateEvent;
type JobFinishAction = JobFinishEvent;
type ResponseAddAction = ResponseAddEvent;
type AssessmentAddAction = AssessmentAddEvent;

type ActionTypes =
  | JobCreateAction
  | JobUpdateAction
  | JobFinishAction
  | ResponseAddAction
  | AssessmentAddAction;

function updateJob(state: JobState, action: JobUpdateAction) {
  return {
    ...state,
    jobId: action.id,
    assessments: action.assessments.sort((a, b) =>
      String(a.id).localeCompare(String(b.id))
    ),
  };
}

function addResponse(state: JobState, action: ResponseAddAction) {
  const assessments = [...state.assessments, ...action.assessments].filter(
    (assessment, index, self) =>
      index === self.findIndex((a) => a.id === assessment.id)
  );

  return {
    ...state,
    assessments,
  };
}

function addAssessment(state: JobState, action: AssessmentAddAction) {
  return {
    ...state,
    assessments: [
      ...state.assessments.filter((a) => a.id != action.id),
      action.assessment,
    ].sort((a, b) => String(a.id).localeCompare(String(b.id))),
  };
}

function reducer(state: JobState, action: ActionTypes): JobState {
  switch (action.type) {
    case "JOB_UPDATE": {
      return updateJob(state, action);
    }
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

export function useJobStream({
  jobId,
  initialAssessments,
}: {
  jobId: string;
  initialAssessments: Assessment[];
}) {
  const [state, dispatchMessages] = useReducer(reducer, {
    jobId,
    assessments: initialAssessments,
  });
  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws/jobs/${jobId}/`;

  const { lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("[socket] connected", jobId),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
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

  const setAssessments = useCallback(
    (jobId: string, assessments: Assessment[]) => {
      dispatchMessages({ type: "JOB_UPDATE", id: jobId, assessments });
    },
    []
  );

  return {
    connected: readyState === ReadyState.OPEN,
    jobId: state.jobId,
    assessments: state.assessments,
    setAssessments,
  };
}
