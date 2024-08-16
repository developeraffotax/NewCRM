import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { style } from "../../utlis/CommonStyle";

const jobs = [
  "Book Keeping",
  "Payroll",
  "VAT Return",
  "Accounts",
  "Personal Tax",
  "Company Sec",
  "Address",
  "Subscription",
];

export default function NewJobModal({ setIsOpen }) {
  const [isloading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [address, setAddress] = useState("");
  const [jobName, setJobName] = useState("");
  const [clientBookKeepingFormData, setClientBookKeepingFormData] = useState({
    job_name: "Bookkeeping",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });
  const [clientPayRollFormData, setClientPayRollFormData] = useState({
    job_name: "Payroll",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });
  const [clientVatReturnFormData, setClientVatReturnFormData] = useState({
    job_name: "Vat Return",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });
  const [clientAccountsFormData, setClientAccountsFormData] = useState({
    job_name: "Accounts",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });
  const [clientPersonalTaxFormData, setClientPersonalTaxFormData] = useState({
    job_name: "Personal Tax",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });
  const [clientCompanySecFormData, setClientCompanySecFormData] = useState({
    job_name: "Company Sec",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });

  const [clientAddressFormData, setClientAddressFormData] = useState({
    job_name: "Address",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
  });
  const [clientSubscriptionFormData, setClientSubscriptionFormData] = useState({
    job_name: "Subscription",
    year_end: "",
    job_deadline: "",
    work_deadline: "",
    hours: "",
    fee: "",
    manager_id: "",
    job_holder_id: "",
    subscription: "",
  });

  const partners = ["Affotax", "Outsource", "OTL"];
  const sources = ["AIV", "UPW", "PPH", "Website", "Referal", "Partner"];
  const clients = ["Limited", "LLP", "Individual", "Non UK"];
  const leads = ["Rashid", "Salman", "M Ali"];
  const JobHolders = ["Rashid", "Salman", "M Ali"];

  //   Add Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  //   Get Currect Date
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Set the current date when the component mounts
  useEffect(() => {
    const date = getCurrentDate();
    setCurrentDate(date);
  }, []);

  return (
    <div className="relative w-full h-[100%] mt-[1rem] py-3 px-3 sm:px-4 bg-gray-200 overflow-y-scroll ">
      <div className="w-full py-1 bg-orange-500/35 flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="h-[3rem] w-[8rem]" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full"></div>
        <h1 className="text-lg font-medium my-3 w-fit py-2 px-4 rounded-md text-white bg-[#254e7f]">
          Add New Client
        </h1>

        <form className="w-full h-full flex flex-col gap-5 ">
          <div className="w-full h-full grid grid-cols-1 gap-6 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {/* 1 */}
            <div className="flex flex-col gap-3">
              <h3 className="w-full h-[2.7rem] rounded-md text-white bg-[#254e7f] flex items-center justify-center text-[16px] sm:text-[18px] font-[300] ">
                Job Details
              </h3>
              <input
                type="text"
                placeholder="Client Name"
                className={`${style.input}`}
              />
              <input
                type="text"
                placeholder="Reg Number"
                className={`${style.input}`}
              />
              <input
                type="text"
                placeholder="Company Name"
                className={`${style.input}`}
              />
              <input
                type="email"
                placeholder="Email"
                className={`${style.input}`}
              />
              <input
                type="text"
                placeholder="Hours"
                className={`${style.input}`}
              />
            </div>
            {/* 2 */}
            <div className="flex flex-col gap-3">
              <h3 className="w-full h-[2.7rem] rounded-md text-white bg-[#254e7f] flex items-center justify-center text-[16px] sm:text-[18px] font-[300] ">
                Sales Details
              </h3>
              <input
                type="date"
                placeholder="Current Date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className={`${style.input}`}
              />
              <select className={`${style.input} h-[2.5rem] `}>
                <option value="">Source</option>
                {sources?.map((s, i) => (
                  <option value={s} key={i}>
                    {s}
                  </option>
                ))}
              </select>

              <select className={`${style.input} h-[2.5rem] `}>
                <option value="">Client Type</option>
                {clients?.map((c, i) => (
                  <option value={c} key={i}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Country"
                className={`${style.input}`}
              />
              <input
                type="text"
                placeholder="Fee"
                className={`${style.input}`}
              />
            </div>
            {/* 3 */}
            <div className="flex flex-col gap-3">
              <h3 className="w-full h-[2.7rem] rounded-md text-white bg-[#254e7f] flex items-center justify-center text-[16px] sm:text-[18px] font-[300] ">
                Login Information
              </h3>
              <input
                type="test"
                placeholder="CT Login"
                className={`${style.input}`}
              />
              <input
                type="test"
                placeholder="PYE Login"
                className={`${style.input}`}
              />
              <input
                type="test"
                placeholder="TR Login"
                className={`${style.input}`}
              />
              <input
                type="text"
                placeholder="VAT Login"
                className={`${style.input}`}
              />
            </div>
            {/* 4 */}
            <div className="flex flex-col gap-3">
              <h3 className="w-full h-[2.7rem] rounded-md text-white bg-[#254e7f] flex items-center justify-center text-[16px] sm:text-[18px] font-[300] ">
                Tax Number
              </h3>
              <input
                type="text"
                placeholder="Authentication Code"
                className={`${style.input}`}
              />
              <input
                type="text"
                placeholder="UTR"
                className={`${style.input}`}
              />
            </div>
          </div>

          {/*---------- Jobs--------- */}
          <div className="flex flex-col gap-4">
            {/* 1 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientBookKeepingFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientBookKeepingFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientBookKeepingFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientBookKeepingFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientBookKeepingFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientBookKeepingFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientBookKeepingFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientBookKeepingFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
            {/* 2 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientPayRollFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientPayRollFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientPayRollFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientPayRollFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientPayRollFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientPayRollFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientPayRollFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientPayRollFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
            {/* 3 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientVatReturnFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientVatReturnFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientVatReturnFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientVatReturnFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientVatReturnFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientVatReturnFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientVatReturnFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientVatReturnFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>

            {/* 4 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientPersonalTaxFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientPersonalTaxFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientPersonalTaxFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientPersonalTaxFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientPersonalTaxFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientPersonalTaxFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientPersonalTaxFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientPersonalTaxFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
            {/* 5 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientAccountsFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientAccountsFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientAccountsFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientAccountsFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientAccountsFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientAccountsFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientAccountsFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientAccountsFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
            {/* 6 */}
            <div className="flex items-center gap-4">
              <label className="flex  items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientCompanySecFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientCompanySecFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientCompanySecFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientCompanySecFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientCompanySecFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientCompanySecFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientCompanySecFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientCompanySecFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
            {/* 7 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium bg-gray-300 w-[10rem] rounded-md py-[5px] px-[.6rem]">
                  {clientAddressFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientAddressFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientAddressFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientAddressFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientAddressFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientAddressFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientAddressFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientAddressFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
            {/* 8 */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 w-full">
                <input type="checkbox" />
                <span className="font-medium w-[10rem] bg-gray-300 rounded-md py-[5px] px-[.6rem]">
                  {clientSubscriptionFormData.job_name}
                </span>
              </label>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientSubscriptionFormData.year_end}
                  className={`${style.input} w-full`}
                />
                <span>Year End</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientSubscriptionFormData.job_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="date"
                  placeholder="Year End"
                  value={clientSubscriptionFormData.work_deadline}
                  className={`${style.input} w-full`}
                />
                <span>Deadline</span>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Hours"
                  value={clientSubscriptionFormData.hours}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Fee"
                  value={clientSubscriptionFormData.fee}
                  className={`${style.input} w-[3rem]`}
                />
              </div>
              <select
                value={clientSubscriptionFormData.manager_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value="">Lead</option>
                {leads.map((lead) => (
                  <option key={lead} value={lead}>
                    {lead}
                  </option>
                ))}
              </select>
              <select
                value={clientSubscriptionFormData.job_holder_id}
                className={`${style.input} w-full h-[2.7rem]`}
              >
                <option value=""> Job holder</option>
                {JobHolders.map((jh) => (
                  <option key={jh} value={jh}>
                    {jh}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
