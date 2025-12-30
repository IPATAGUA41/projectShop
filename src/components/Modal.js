// ========================================
// Modal Component - Reusable Modal
// ========================================

export class Modal {
    constructor(options = {}) {
        this.id = options.id || `modal-${Date.now()}`;
        this.title = options.title || '';
        this.onSubmit = options.onSubmit || null;
        this.onClose = options.onClose || null;
        this.element = null;
    }

    /**
     * Create modal HTML
     * @param {string} content - Modal content HTML
     * @returns {string} Complete modal HTML
     */
    createHTML(content) {
        return `
      <div id="${this.id}" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>${this.title}</h3>
            <button class="modal-close" data-modal-close>&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Show the modal
     */
    show() {
        if (this.element) {
            this.element.classList.add('active');
        }
    }

    /**
     * Hide the modal
     */
    hide() {
        if (this.element) {
            this.element.classList.remove('active');
            if (this.onClose) {
                this.onClose();
            }
        }
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        if (!this.element) return;

        // Close buttons
        const closeButtons = this.element.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.hide());
        });

        // Click outside to close
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.hide();
            }
        });

        // Form submission
        const form = this.element.querySelector('form');
        if (form && this.onSubmit) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                this.onSubmit(data, form);
            });
        }
    }

    /**
     * Mount modal to DOM
     * @param {string} content - Modal content HTML
     */
    mount(content) {
        const html = this.createHTML(content);
        const temp = document.createElement('div');
        temp.innerHTML = html;
        this.element = temp.firstElementChild;
        document.body.appendChild(this.element);
        this.attachEvents();
    }

    /**
     * Destroy modal
     */
    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
