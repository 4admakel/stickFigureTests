const canvas = document.getElementById('stick-figure');
const ctx = canvas.getContext('2d');

// Line color (initially black)
let lineColor = '#000';

// Define the joint positions
const joints = {
    head: { x: 150, y: 40 },
    neck: { x: 150, y: (40 + 120) / 2 }, // Reduced neck length
    leftShoulder: { x: 110, y: 120 },
    rightShoulder: { x: 190, y: 120 },
    leftElbow: { x: 80, y: 180 },
    rightElbow: { x: 210, y: 180 },
    chest: { x: 150, y: (120 + 240) / 2 }, // Moved chest halfway between neck and waist
    waist: { x: 150, y: 240 },
    leftKnee: { x: 110, y: 320 },
    rightKnee: { x: 190, y: 320 },
    leftFoot: { x: 110, y: 380 },
    rightFoot: { x: 190, y: 380 }
};

// Draw the stick figure with bones and circles around the joints
function drawStickFigure() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line width for bones (doubled)
    ctx.lineWidth = 16;

    // Set line color
    ctx.strokeStyle = lineColor;

    // Draw bones
    drawBone(joints.head, joints.neck);
    drawBone(joints.neck, joints.leftShoulder);
    drawBone(joints.neck, joints.rightShoulder);
    drawBone(joints.leftShoulder, joints.leftElbow);
    drawBone(joints.rightShoulder, joints.rightElbow);
    drawBone(joints.neck, joints.chest);
    drawBone(joints.chest, joints.waist);
    drawBone(joints.waist, joints.leftKnee);
    drawBone(joints.waist, joints.rightKnee);
    drawBone(joints.leftKnee, joints.leftFoot); // New bone
    drawBone(joints.rightKnee, joints.rightFoot); // New bone

    // Draw a solid circle around the head (doubled diameter)
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(joints.head.x, joints.head.y, 40, 0, Math.PI * 2); // Doubled diameter
    ctx.fill();

    // Draw circles for joints with reduced diameter and dotted lines
    ctx.strokeStyle = lineColor; // Use line color for joint outlines

    for (const joint in joints) {
        const { x, y } = joints[joint];

        // Set line style to dotted
        ctx.setLineDash([1, 2]); // 1 pixel dot, 2 pixels gap
        ctx.lineWidth = 2; // Doubled width
        

        // Draw a circle with a black outline
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2); // Doubled diameter
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ctx.stroke();

        // Draw a red dot in the center (reduced diameter by half)
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2); // Reduced diameter by half
        ctx.fillStyle = 'red';
        ctx.fill();

        // Reset line style and width
        ctx.setLineDash([]);
        ctx.lineWidth = 16; // Doubled line width
    }
}

// Helper function to draw a bone
function drawBone(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

// Initialize the stick figure
drawStickFigure();

// Make the joints draggable
let selectedJoint = null;

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    for (const joint in joints) {
        const { x, y } = joints[joint];
        if (Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2) <= 10) { // Adjusted the radius for interaction
            selectedJoint = joint;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedJoint) {
        joints[selectedJoint] = {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        };
        drawStickFigure();
    }
});

canvas.addEventListener('mouseup', () => {
    selectedJoint = null;
});

// Add the snapshot button functionality
const snapshotButton = document.getElementById('snapshotButton');
snapshotButton.addEventListener('click', () => {
    // Create a temporary canvas to draw the stick figure
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the stick figure on the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Convert the temporary canvas to a data URL (base64)
    const dataURL = tempCanvas.toDataURL('image/png');

    // Create a link element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'stick.png'; // Set the filename
    downloadLink.style.display = 'none';

    // Append the link to the document and trigger a click event to download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up: remove the link element
    document.body.removeChild(downloadLink);
});

// Add event listeners to color buttons
document.getElementById('blackButton').addEventListener('click', () => {
    lineColor = '#000';
    drawStickFigure();
});

document.getElementById('greyButton').addEventListener('click', () => {
    lineColor = '#808080'; // Grey
    drawStickFigure();
});

document.getElementById('orangeButton').addEventListener('click', () => {
    lineColor = 'orange';
    drawStickFigure();
});

document.getElementById('greenButton').addEventListener('click', () => {
    lineColor = 'green';
    drawStickFigure();
});

document.getElementById('redButton').addEventListener('click', () => {
    lineColor = 'red';
    drawStickFigure();
});

document.getElementById('blueButton').addEventListener('click', () => {
    lineColor = 'blue';
    drawStickFigure();
});

document.getElementById('purpleButton').addEventListener('click', () => {
    lineColor = 'purple';
    drawStickFigure();
});

// Create a new gif.js object
const gif = new GIF({
    quality: 10,
    workers: 2,
    workerScript: 'https://cdn.rawgit.com/jnordberg/gif.js/master/dist/gif.worker.js', // Make sure the path to the worker script is correct
});

// Variables for GIF recording
let isRecordingGIF = false;

// Start Recording GIF button click event
const startRecordingGIFButton = document.getElementById('startRecordingGIFButton');
startRecordingGIFButton.addEventListener('click', () => {
    if (!isRecordingGIF) {
        gif.abort();
        gif.frames = [];
        isRecordingGIF = true;
        startRecordingGIFButton.setAttribute('disabled', true);
        stopRecordingGIFButton.removeAttribute('disabled');
        recordGIF();
    }
});

// Stop Recording GIF button click event
const stopRecordingGIFButton = document.getElementById('stopRecordingGIFButton');
stopRecordingGIFButton.addEventListener('click', () => {
    if (isRecordingGIF) {
        isRecordingGIF = false;
        startRecordingGIFButton.removeAttribute('disabled');
        stopRecordingGIFButton.setAttribute('disabled', true);
        gif.render();
    }
});

function recordGIF() {
    if (isRecordingGIF) {
        gif.addFrame(canvas, { copy: true, delay: 100 });
        setTimeout(recordGIF, 100);
    }
}

// ... Your existing code ...

