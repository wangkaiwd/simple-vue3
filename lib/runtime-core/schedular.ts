import { Fn } from "../types";

const jobs = [];
let pending = false;
const resolvedPromise = Promise.resolve();
let currentFlushPromise;

const flushJobs = () => {
  jobs.forEach((job) => job());
  pending = false;
};

const queueFlush = () => {
  if (!pending) {
    pending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
};

export const queueJob = (job: Fn) => {
  if (!jobs.includes(job)) {
    jobs.push(job);
  }
  queueFlush();
};

export const nextTick = (job: Fn) => {
  const p = currentFlushPromise || resolvedPromise;
  return job ? p.then(job) : p;
};
