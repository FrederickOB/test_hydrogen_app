import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

export function Select ({
  value,
  setValue,
  data,
  label,
  error,
  itemName,
  multiselect = false,
  textColor = ' ',
}) {
  return (
    <>
      <Listbox value={value} onChange={setValue} multiple={multiselect}>
        {label && (
          <Listbox.Label className={`text-sm font-bold ${textColor}`}>
            {label}:
          </Listbox.Label>
        )}
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white border rounded-lg shadow-md cursor-default border-amber-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate text-black">
              {multiselect
                ? value.map((val) => val[itemName]).join(', ')
                : value[itemName]}
            </span>
            <span className="absolute inset-y-0 right-0 flex flex-col items-center pr-2 mt-1 text-gray-400 pointer-events-none">
              <FontAwesomeIcon icon={faAngleUp} />
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data && data.length > 0 ? (
                data.map((item, idx) => (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-300' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => {
                      return (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {item[itemName]}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-300">
                              <FontAwesomeIcon icon={faCheckCircle} />
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  </Listbox.Option>
                ))
              ) : (
                <div
                  className={`relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900`}
                >
                  <span className={`block truncate font-normal `}>
                    No item in list
                  </span>
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </>
  );
}
