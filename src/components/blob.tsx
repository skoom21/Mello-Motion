import Spline from "@splinetool/react-spline";

export default function Blob() {
    function onSplineLoad(splineApp: {
        findObjectByName: (arg0: string) => any;
    }) {
        // Optional: Use this function to interact with the Spline objects if needed
        const object = splineApp.findObjectByName("Cube");
        console.log(object); // Logs the Spline object details
    }

    return (
        <div style={{ width: '300px', height: '300px' }}>
            <Spline
                scene="https://prod.spline.design/ghdS97JsqhE8afFJ/scene.splinecode"
                onLoad={onSplineLoad}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
