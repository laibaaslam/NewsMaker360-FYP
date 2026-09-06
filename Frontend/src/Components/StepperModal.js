// import React from 'react';
// import Stepper from './Stepper.js';

// const StepperModal = ({ steps, currentStep, stepStatus, processingSteps }) => {
//     return (
//         <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
//             <div className="p-8 rounded-lg">
//                 <Stepper steps={steps} currentStep={currentStep} stepStatus={[false, false, false, false, false]} processingSteps={processingSteps} />
//             </div>
//         </div>
//     );
// };

// export default StepperModal;

import React from 'react';
import Stepper from './Stepper.js';

const StepperModal = ({ steps, currentStep, processingSteps, subProgress }) => {

    // // Function to disable scrolling on the user dashboard
    // const disableScroll = () => {
    //     document.body.style.overflow = 'hidden';
    // };

    // // Function to enable scrolling on the user dashboard
    // const enableScroll = () => {
    //     document.body.style.overflow = 'auto';
    // };

    // // Call disableScroll when the modal is opened and enableScroll when it's closed
    // React.useEffect(() => {
    //     disableScroll();
    //     return () => enableScroll();
    // }, []);
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-70">
            <div className="p-8 rounded-lg w-full max-w-6xl">
                <Stepper
                    steps={steps}
                    currentStep={currentStep}
                    processingSteps={processingSteps}
                    subProgress={subProgress}
                />
            </div>
        </div>
    );
};

export default StepperModal;
