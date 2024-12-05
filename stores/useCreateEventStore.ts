import { Interview } from "@/features/calendar/models/interview";
import Interviewee from "@/features/calendar/models/interviewee";
import Job from "@/features/calendar/models/job";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CreateEventState {
  open: boolean;
  interviewId?: string;
  step: number;
  job?: Job;
  interview?: Interview;
  interviewee?: Interviewee;
}

interface CreateEventActions {
  setOpen: (open: boolean, interviewId?: string) => void;
  setInterviewId: (interviewId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  setJob: (job: Job) => void;
  setInterview: (interview: Interview) => void;
  setInterviewee: (interviewee: Interviewee) => void;
}

export const DefaultCreateEventState: CreateEventState = {
  open: false,
  step: 1,
};

export const useCreateEventStore = create<
  CreateEventState & CreateEventActions
>()(
  immer((set) => ({
    ...DefaultCreateEventState,
    // setOpen: (open, interviewId) =>
    //   set((state) => {
    //     state.open = open;
    //     if (!open) {
    //       state.step = 1;
    //       state.interviewId = undefined;
    //       state.job = undefined;
    //       state.interview = undefined;
    //       state.interviewee = undefined;
    //     }
    //     if (interviewId) state.interviewId = interviewId;
    //   }),
    setOpen: (open, interviewId) =>
      set((state) => ({
        ...state,
        open,
        ...(interviewId && { interviewId }),
        ...(!open && {
          step: 1,
          interviewId: undefined,
          job: undefined,
          interview: undefined,
          interviewee: undefined,
        }),
      })),
    setInterviewId: (interviewId) =>
      set((state) => {
        state.interviewId = interviewId;
      }),
    nextStep: () =>
      set((state) => {
        if (state.step < 3) {
          state.step += 1;
        }
      }),
    previousStep: () =>
      set((state) => {
        if (state.step > 1) {
          state.step -= 1;
        }
      }),
    setJob: (job) =>
      set((state) => {
        state.job = job;
      }),
    setInterview: (interview) =>
      set((state) => {
        state.interview = interview;
      }),
    setInterviewee: (interviewee) =>
      set((state) => {
        state.interviewee = interviewee;
      }),
  })),
);
