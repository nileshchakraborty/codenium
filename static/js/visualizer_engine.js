/**
 * LeetCode Smart Visualizer Engine
 * Handles dynamic rendering of Arrays, Pointers, and Animations.
 */

class VisualizerEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.state = null;
        this.currentStep = 0;
        this.interval = null;
        this.speed = 1000;
    }

    load(visualizationData) {
        this.data = visualizationData;
        this.state = JSON.parse(JSON.stringify(this.data.initialState)); // Deep copy
        this.currentStep = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        // Controls
        const controls = document.createElement('div');
        controls.className = 'viz-controls';
        controls.innerHTML = `
            <button onclick="viz.prev()">⏮</button>
            <button onclick="viz.playPause()" id="playBtn">▶</button>
            <button onclick="viz.next()">⏭</button>
            <span class="step-counter">Step ${this.currentStep} / ${this.data.animationSteps.length}</span>
        `;
        this.container.appendChild(controls);

        // Canvas / DOM Area
        const stage = document.createElement('div');
        stage.className = 'viz-stage';
        this.container.appendChild(stage);

        if (this.data.visualizationType === 'array') {
            this.renderArray(stage);
        }
    }

    renderArray(stage) {
        const arrayContainer = document.createElement('div');
        arrayContainer.className = 'viz-array-container';

        this.state.forEach((val, idx) => {
            const item = document.createElement('div');
            item.className = 'viz-array-item';

            // Value
            const value = document.createElement('span');
            value.className = 'viz-value';
            value.textContent = val;
            item.appendChild(value);

            // Index
            const index = document.createElement('span');
            index.className = 'viz-index';
            index.textContent = idx;
            item.appendChild(index);

            // Check for active highlights from current step
            // We need to re-compute state up to current step or keep state up to date.
            // For simplicity, let's assume we re-calculate or just "apply" transient styles
            // But waiting: "initialState" is just [numbers]. 
            // "animationSteps" say what changes.
            // It's better if we have a "computed state" for the current step.

            arrayContainer.appendChild(item);
        });

        stage.appendChild(arrayContainer);

        // Apply current step visuals
        if (this.currentStep > 0 && this.currentStep <= this.data.animationSteps.length) {
            const step = this.data.animationSteps[this.currentStep - 1];
            this.applyStepVisuals(step, arrayContainer);
        }
    }

    applyStepVisuals(step, container) {
        const items = container.querySelectorAll('.viz-array-item');

        if (step.type === 'highlight') {
            step.indices.forEach(i => {
                if (items[i]) items[i].classList.add(step.color || 'accent');
            });
        }

        // Pointers?
        if (step.pointers) {
            step.pointers.forEach(p => {
                const item = items[p.index];
                if (item) {
                    const ptr = document.createElement('div');
                    ptr.className = 'viz-pointer';
                    ptr.textContent = p.label || '↑';
                    item.appendChild(ptr);
                }
            });
        }

        // Message
        if (step.transientMessage) {
            const msg = document.createElement('div');
            msg.className = 'viz-message';
            msg.textContent = step.transientMessage;
            this.container.appendChild(msg);
        }
    }

    next() {
        if (this.currentStep < this.data.animationSteps.length) {
            this.currentStep++;
            this.render();
        }
    }

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    playPause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            document.getElementById('playBtn').textContent = '▶';
        } else {
            document.getElementById('playBtn').textContent = '⏸';
            this.interval = setInterval(() => {
                if (this.currentStep < this.data.animationSteps.length) {
                    this.next();
                } else {
                    this.playPause(); // Stop at end
                }
            }, this.speed);
        }
    }
}

// Global instance
window.viz = new VisualizerEngine('solutionContent');
