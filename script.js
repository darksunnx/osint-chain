
let stage = new Konva.Stage({
  container: 'stage-container',
  width: window.innerWidth - 220,
  height: window.innerHeight
});
let layer = new Konva.Layer();
stage.add(layer);

let nodes = [];
let selectedNode = null;

function addNode(type) {
  const group = new Konva.Group({
    x: 100 + Math.random() * 300,
    y: 100 + Math.random() * 200,
    draggable: true
  });

  const box = new Konva.Rect({
    width: 150,
    height: 60,
    fill: '#2a2a2a',
    stroke: '#555',
    strokeWidth: 2,
    cornerRadius: 10,
    shadowColor: 'black',
    shadowBlur: 5,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.3
  });

  const text = new Konva.Text({
    text: type,
    fontSize: 16,
    fill: 'white',
    padding: 10,
    width: 150,
    align: 'center',
    name: 'node-text'
  });

  group.add(box);
  group.add(text);
  layer.add(group);
  layer.draw();

  group.on('dblclick', () => {
    selectedNode = group;
    document.getElementById('node-title').value = text.text();
    document.getElementById('node-type').value = type;
    document.getElementById('property-popup').classList.remove('hidden');
  });

  nodes.push({ group, type, text });
}

function saveProperties() {
  const newText = document.getElementById('node-title').value;
  const newType = document.getElementById('node-type').value;
  if (selectedNode) {
    const textNode = selectedNode.findOne('.node-text');
    textNode.text(newText);
    selectedNode.getLayer().draw();
  }
  closePropertyPopup();
}

function closePropertyPopup() {
  document.getElementById('property-popup').classList.add('hidden');
  selectedNode = null;
}

function downloadProject() {
  const data = nodes.map(n => ({
    x: n.group.x(),
    y: n.group.y(),
    text: n.text.text(),
    type: n.type
  }));
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.osint';
  a.click();
}

function loadProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);
    nodes = [];
    layer.destroyChildren();
    data.forEach(n => {
      addNode(n.type);
      const node = nodes[nodes.length - 1];
      node.group.x(n.x);
      node.group.y(n.y);
      node.text.text(n.text);
    });
    layer.draw();
  };
  reader.readAsText(file);
}

function exportAsImage() {
  const dataURL = stage.toDataURL({ pixelRatio: 2 });
  const a = document.createElement('a');
  a.download = 'darksint-map.png';
  a.href = dataURL;
  a.click();
}
