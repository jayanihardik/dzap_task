import { useMemo, useState } from "react";
import {
  findDuplicates,
  isEmpty,
  splitValueBYPattern,
  validationByPattern,
} from "../../helpers/utils";
import INFO_ICON from "./images/info.svg";

import "./index.css";

const DisplayError = ({ listOfErorr }: any) => {
  return (
    <div className="flex rounded-md	p-3 m-3 border border-red-600">
      <div className="w-7">
        <img width={20} className="my-0.5" src={INFO_ICON} alt="Info" />
      </div>
      <div>
        {listOfErorr.map((x: string) => (
          <div className="text-red-500">{x}</div>
        ))}
      </div>
    </div>
  );
};

const DisplayDuplicated = ({ combineBalance, keepTheFirst }: any) => {
  return (
    <div className="flex justify-between m-3">
      <div className="text-white">Duplicated</div>
      <div className="text-red-500">
        <span className="font-semibold" onClick={keepTheFirst}>
          Keep the first one
        </span>
        <span> | </span>
        <span className="font-semibold" onClick={combineBalance}>
          Combine Balance
        </span>
      </div>
    </div>
  );
};

const Disperse = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setErrors] = useState<string[]>([]);
  const [isDuplicated, setIsDuplicated] = useState<boolean>(false);

  const onSubmit = () => {
    validateAddress();
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);
    setIsDuplicated(false);
    setErrors([]);
  };

  const addressesValues: string[] = useMemo(() => {
    if (!!inputValue.length) {
      const splitAddressesValues = inputValue?.split(splitValueBYPattern);
      return splitAddressesValues;
    }
    return [];
  }, [inputValue]);

  const validateAddress = () => {
    const errorArr = validationByPattern(addressesValues);
    const duplicatedAddress = !isEmpty(findDuplicates(addressesValues));
    setErrors(errorArr);
    setIsDuplicated(duplicatedAddress);
  };

  const keepTheFirst = () => {};

  const combineBalance = () => {};

  console.log(addressesValues);

  return (
    <div className="w-full">
      <div className="flex justify-between m-3">
        <div className="text-white font-semibold">Addresses with Amount</div>
        <div className="text-white font-semibold">Upload File</div>
      </div>
      <div className="m-3">
        <div className="flex bg-black p-6">
          <div className="text-white border-r-2 pr-3 border-white-600">
            {(!isEmpty(addressesValues) &&
              addressesValues?.map((x, i) => <div> {i + 1} </div>)) ||
              1}
          </div>
          <div className="w-full">
            <textarea
              className="pl-3 font-semibold w-full h-full bg-black text-white min-h-300 outline-none"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between m-3">
        <div className="text-white font-semibold">
          Separated by ',' or ' ' or '='
        </div>
        <div className="text-stone-400 font-semibold">Show Example</div>
      </div>

      {isDuplicated && isEmpty(error) && (
        <DisplayDuplicated
          keepTheFirst={keepTheFirst}
          combineBalance={combineBalance}
        />
      )}

      {!isEmpty(error) && <DisplayError listOfErorr={error} />}

      <div className="m-3 ">
        <button
          className={
            !isEmpty(error) || isDuplicated
              ? "bg-black w-full text-white h-16 rounded-full mt-10 text-lg font-semibold"
              : "bg-gradient-to-r from-purple-500 to-indigo-600 w-full text-white h-16 rounded-full mt-10 text-lg font-semibold"
          }
          onClick={onSubmit}
          type="submit"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Disperse;
