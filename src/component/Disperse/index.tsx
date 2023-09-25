import { FC, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  findDuplicates,
  getSplitter,
  isEmpty,
  splitAddress,
  splitValueBYPattern,
  validationByPattern,
} from "../../helpers/utils";

import "./index.css";

interface DisplayDuplicatedProps {
  combineBalance: () => void;
  keepTheFirst: () => void;
}

interface DisplayErrorProps {
  listOfErorr: string[];
  duplicates: IType | null;
}

type TList = [string, string, number];

interface IType {
  [key: string]: {
    list: TList[];
  };
}

const DisplayError: FC<DisplayErrorProps> = ({
  listOfErorr,
  duplicates,
}: any) => {
  return (
    <div className="flex rounded-md	p-3 m-3 border border-red-600">
      <div className="w-7">
        <img width={20} className="my-0.5" src="/images/info.svg" alt="Info" />
      </div>
      <div>
        {!isEmpty(listOfErorr) &&
          listOfErorr?.map((x: string) => (
            <div key={x} className="text-red-500">
              {x}
            </div>
          ))}
        {!isEmpty(duplicates) &&
          Object.keys(duplicates)?.map((k: string) => (
            <div key={k} className="text-red-500">
              {k} diplicate in Line :{" "}
              {duplicates[k].list
                ?.map((item: string) => item[2] + 1)
                ?.join(", ")}
            </div>
          ))}
      </div>
    </div>
  );
};

const DisplayDuplicated: FC<DisplayDuplicatedProps> = ({
  combineBalance,
  keepTheFirst,
}) => {
  return (
    <div className="flex justify-between m-3">
      <div className="text-white">Duplicated</div>
      <div className="text-red-500">
        <span className="font-semibold cursor-pointer" onClick={keepTheFirst}>
          Keep the first one
        </span>
        <span className="ml-4 mr-4"> | </span>
        <span className="font-semibold cursor-pointer" onClick={combineBalance}>
          Combine Balance
        </span>
      </div>
    </div>
  );
};

const Disperse = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setErrors] = useState<string[]>([]);
  const [duplicates, setDuplicated] = useState<IType | null>(null);

  const addressesValues: string[] = useMemo(() => {
    if (!!inputValue.length) {
      const splitAddressesValues = inputValue?.split(splitValueBYPattern);
      return splitAddressesValues;
    }
    return [];
  }, [inputValue]);

  const validateAddress = (value: string[] = addressesValues) => {
    const errorArr = validationByPattern(value);
    setErrors(errorArr);
    let duplicatedAddress;
    if (isEmpty(errorArr)) {
      duplicatedAddress = findDuplicates(value);
    }
    setDuplicated(duplicatedAddress);
    if (isEmpty(errorArr) && isEmpty(duplicatedAddress)) {
      toast.success("Success");
    }
  };

  const onSubmit = () => {
    validateAddress();
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);
    setDuplicated({});
    setErrors([]);
  };

  const keepTheFirst = () => {
    const newInputValue: string[] = inputValue?.split(splitValueBYPattern);
    duplicates &&
      Object.keys(duplicates).forEach((item: string) => {
        duplicates[item].list.forEach((v: TList, i: number) => {
          if (i !== 0) {
            const index: number = v[2];
            newInputValue[index] = "";
          }
        });
      });

    const newValue: string = newInputValue.filter((v) => !!v).join("\n");
    setInputValue(newValue);
    validateAddress(newValue?.split(splitValueBYPattern));
  };

  const combineBalance = () => {
    if (duplicates) {
      const newInputValue: string[] = inputValue?.split(splitValueBYPattern);

      Object.keys(duplicates).forEach((item: string) => {
        const splitter = getSplitter(
          newInputValue[duplicates[item].list[0][2]]
        );
        const values: (string | number)[] = splitAddress(
          newInputValue[duplicates[item].list[0][2]]
        );

        duplicates &&
          duplicates[item].list.forEach((v: TList, i: number) => {
            if (i !== 0) {
              values[1] = +values[1] + +v[1];
              const index: number = v[2];
              newInputValue[index] = "";
            }
          });
        newInputValue[duplicates[item].list[0][2]] = values.join(splitter);
      });
      const newValue = newInputValue.filter((v) => !!v).join("\n");
      setInputValue(newValue);
      validateAddress(newValue?.split(splitValueBYPattern));
    }
  };

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
              addressesValues?.map((x, i) => (
                <div key={i + x}> {i + 1} </div>
              ))) ||
              1}
          </div>
          <div className="w-full">
            <textarea
              className="pl-3 font-semibold w-full h-full bg-black text-white min-h-300 outline-none"
              value={inputValue}
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

      {!isEmpty(duplicates) && (
        <DisplayDuplicated
          keepTheFirst={keepTheFirst}
          combineBalance={combineBalance}
        />
      )}

      {(!isEmpty(error) || !isEmpty(duplicates)) && (
        <DisplayError listOfErorr={error} duplicates={duplicates} />
      )}

      <div className="m-3 ">
        <button
          className={
            !isEmpty(error) || !isEmpty(duplicates)
              ? "bg-black w-full text-white h-16 rounded-full mt-10 text-lg font-semibold mb-4 outline-none"
              : "bg-gradient-to-r from-purple-500 to-indigo-600 w-full text-white h-16 rounded-full mb-4 outline-none mt-10 text-lg font-semibold"
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
