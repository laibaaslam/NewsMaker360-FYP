import React from 'react';

const Stepper = ({ steps, currentStep, processingSteps, subProgress }) => {
    // console.log(processingSteps);
    // console.log("current step" + steps[currentStep])

    const calculateProgressBarWidth = () => {
        const completedSteps = steps.slice(0, currentStep).filter((_, index) => processingSteps[index]);
        return (completedSteps.length / (steps.length - 1)) * 100;
    }

    return (
        <div className="relative flex justify-between items-center w-full mx-8 pb-24">

            {/* <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 z-0 transform -translate-y-1/2"></div> */}
            {/* Progres Bar */}
            <div className="absolute top-1/2 left-8 right-8 transform -translate-y-1/2 w-auto h-1 bg-gray-300 z-0">
                <div className='h-full bg-[#268d3e] transition-all duration-500 ease' style={{ width: `${calculateProgressBarWidth()}%` }}>

                </div>
            </div>

            {steps.map((step, index) => (
                //  bg-[#004170]
                <div key={index} className="relative flex flex-col bg-white items-center p-4 rounded-lg m-2 z-2 bg-gradient-to-r from-blue-100 to-purple-300 shadow-lg hover:scale-105 transition-transform duration-300">

                    {/* Step number */}
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-2 border-2 ${currentStep > index ? 'border-indigo-800 bg-indigo-800 text-white' : 'border-gray-500'}`}>

                        {!processingSteps[index] ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5M20 12a8 8 0 01-8 8V21.5"></path>
                            </svg>
                        ) : (
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z"></path>
                                <path stroke="currentColor" strokeWidth="2" d="M20 6L9 17l-5-5"></path>
                            </svg>
                        )}


                    </div>


                    {/* Step title */}
                    <div className={`${index !== 0 ? 'hidden md:flex' : 'flex'} flex-col items-center`}>
                        {index !== 0 && <hr className={`flex-1 w-px bg-gray-500`} />}
                        <span className={`text-md font-serif mt-2 font-semibold ${currentStep > index ? 'text-indigo-800' : 'text-gray-500'}`}>{step}</span>
                    </div>

                </div>
            ))
            }

            {subProgress && currentStep === 1 && (
                <div className="absolute left-8 right-8 -bottom-16 bg-white rounded-xl shadow-lg px-6 py-4 z-10">
                    <p className="text-sm font-medium text-indigo-900 mb-2">
                        {subProgress.message || 'Transcribing audio...'}
                    </p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#268d3e] transition-all duration-500 ease-out"
                            style={{ width: `${subProgress.percent || 0}%` }}
                        />
                    </div>
                    {subProgress.totalChunks > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            Segment {subProgress.currentChunk || 0} of {subProgress.totalChunks}
                        </p>
                    )}
                </div>
            )}
        </div >
    );
};

export default Stepper;


