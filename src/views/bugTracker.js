import html from './bugTracker.html';
import './bugTracker.css';

let elements = [];
let body;
let fabricCanvas;

export function show(text) {
    // convert plain HTML string into DOM elements
    let temporary = document.createElement('div');
    temporary.innerHTML = html;
   // temporary.getElementsByClassName('js-widget-dialog')[0].textContent = text;

    // append elements to body
    body = document.getElementsByTagName('body')[0];
    while (temporary.children.length > 0) {
        elements.push(temporary.children[0]);
        body.appendChild(temporary.children[0]);
    }

    

            document.getElementById('bug-report-tab').addEventListener('click', function() {
                console.log("RUNNING Indside bug report tab")
                const bugReport = document.getElementById('bug-report');
                const bugReportTab = document.getElementById('bug-report-tab');

                if (bugReport.classList.contains('open')) {
                    bugReport.classList.remove('open');
                    bugReportTab.style.display = 'block';
                } else {
                    bugReport.classList.add('open');
                    bugReportTab.style.display = 'none';
                    html2canvas(document.body, { useCORS: true, logging: true }).then(canvas => {
                        const img = document.getElementById('screenshot');
                        img.src = canvas.toDataURL();
                    }).catch(error => console.error('Error capturing screenshot:', error));
                }
            });

            document.getElementById('edit-screenshot').addEventListener('click', function() {
                const modal = document.getElementById('annotation-modal');
                modal.classList.add('open');

                const img = document.getElementById('screenshot');
                const canvasElement = document.getElementById('annotation-canvas');
                fabricCanvas = new fabric.Canvas('annotation-canvas', {
                    backgroundColor: 'white'
                });

                fabric.Image.fromURL(img.src, function(oImg) {
                    const editorWidth = document.getElementById('annotation-editor').clientWidth - 40;
                    const editorHeight = document.getElementById('annotation-editor').clientHeight - 80;
                    const scale = Math.min(editorWidth / oImg.width, editorHeight / oImg.height);
                    oImg.scale(scale);
                    fabricCanvas.setWidth(oImg.width * scale);
                    fabricCanvas.setHeight(oImg.height * scale);
                    fabricCanvas.setBackgroundImage(oImg, fabricCanvas.renderAll.bind(fabricCanvas));
                });
            });

            document.getElementById('add-arrow').addEventListener('click', function() {
                const arrow = new fabric.Path('M 0 0 L 0 4 L 2 4 L 2 8 L 8 2 L 2 -4 L 2 0 Z', {
                    left: 100,
                    top: 100,
                    fill: 'red',
                    scaleX: 5,
                    scaleY: 5,
                    originX: 'center',
                    originY: 'center'
                });
                fabricCanvas.add(arrow);
            });

            document.getElementById('add-text').addEventListener('click', function() {
                const text = new fabric.Textbox('Enter text here', {
                    left: 100,
                    top: 200,
                    width: 200,
                    fontSize: 20,
                    borderColor: 'red',
                    cornerColor: 'green',
                    cornerSize: 6,
                    transparentCorners: false,
                    editingBorderColor: 'blue'
                });
                fabricCanvas.add(text).setActiveObject(text);
            });

            document.getElementById('delete-item').addEventListener('click', function() {
                const activeObject = fabricCanvas.getActiveObject();
                if (activeObject) {
                    fabricCanvas.remove(activeObject);
                }
            });

            document.getElementById('save-annotations').addEventListener('click', function() {
                const modal = document.getElementById('annotation-modal');
                const img = document.getElementById('screenshot');
                img.src = fabricCanvas.toDataURL({
                    format: 'png',
                    quality: 0.8
                });
                modal.classList.remove('open');
            });

            document.getElementById('send-report').addEventListener('click', function() {
                const screenshot = document.getElementById('screenshot').src;
                const description = document.getElementById('description').value;

                const formData = new FormData();
                formData.append('description', description);
                formData.append('screenshot', screenshot);

                fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    alert('Bug report sent successfully!');
                    const bugReport = document.getElementById('bug-report');
                    const bugReportTab = document.getElementById('bug-report-tab');
                    bugReport.classList.remove('open');
                    bugReportTab.style.display = 'block';
                })
                .catch(error => console.error('Error sending bug report:', error));
            });

}