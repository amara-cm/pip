/**
 * This code was generated by Builder.io.
 */
import React from 'react';

function TaskProgress({ title, current, target }) {
  return (
    <div className="flex flex-col mt-2.5 w-full leading-none max-w-[370px]">
      <div className="flex gap-5 justify-between px-6 py-5 rounded-2xl bg-neutral-800">
        <div className="self-start text-sm font-bold text-white">
          {title}
        </div>
        <div className="overflow-hidden px-6 py-2.5 text-base font-semibold whitespace-nowrap rounded-lg bg-neutral-700 text-zinc-400">
          {current}/{target}
        </div>
      </div>
    </div>
  );
}

export default TaskProgress;