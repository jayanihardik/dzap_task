import { useMemo, useState } from "react";
import INFO_ICON from "./images/info.svg";
import "./index.css";

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
    setErrors([]);
    setIsDuplicated(false);
  };

  const addressesValues: string[] = useMemo(() => {
    if (inputValue.length) {
      const splitAddressesValues = inputValue?.split(/\r|\r\n|\n/);
      return splitAddressesValues;
    }
    return [];
  }, [inputValue]);

  const validateAddress = () => {
    const errorArr: string[] = [];
    addressesValues.forEach((x, i) => {
      const index = i + 1;
      const splitter = x.includes("=") ? "=" : x.includes(",") ? "," : " ";
      const item = x.split(splitter);
      if (!x.startsWith("0x")) {
        errorArr.push(`Line ${index} invalid Ethereum address.`);
      } else if (item[0].length !== 42) {
        errorArr.push(
          `Line ${index} invalid Ethereum address and wrong amount`
        );
      } else if (isNaN(+item[1])) {
        errorArr.push(`Line ${index} wrong amount`);
      }
    });

    let findDuplicates = addressesValues.filter(
      (item, index) => addressesValues.indexOf(item) !== index
    );

    if (findDuplicates) {
      setIsDuplicated(true);
    }

    setErrors(errorArr);
  };

  const keepTheFirst = () => {};

  const combineBalance = () => {};

  console.log(addressesValues);

  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-center m-10">
        <div className="text-white">Addresses with Amount</div>
        <div className="text-white">Upload File</div>
      </div>
      <div className=" m-10">
        <div>
          <div className="text-white">
            {(addressesValues.length &&
              addressesValues?.map((x, i) => i + 1)) ||
              1}
          </div>
          <div>
            <textarea className="textarea" onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="flex justify-center m-10">
        <div className="text-white">Separated by ','or''or '='</div>
        <div className="text-white">Show Example</div>
      </div>

      {isDuplicated && (
        <div className="flex justify-center m-10">
          <div className="text-white">Duplicated</div>
          <div className="duplicated">
            <span onClick={keepTheFirst}>Keep the first one</span>
            <span> | </span>
            <span onClick={combineBalance}>Combine Balance</span>
          </div>
        </div>
      )}

      {!!error.length && !isDuplicated && (
        <div className="error">
          <div className="imgIcon">
            <img width={20} className="image" src={INFO_ICON} alt="Info" />
          </div>
          <div>
            {error.map((x) => (
              <div className="text-red">{x}</div>
            ))}
          </div>
        </div>
      )}

      <div className="m-10">
        <button className="button" onClick={onSubmit} type="submit">
          Next
        </button>
      </div>
    </div>
  );
};

export default Disperse;
