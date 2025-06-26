import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { Popover, Tooltip } from "bootstrap";

// Axios Config
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Enabling Popover and Tooltip
document.addEventListener('DOMContentLoaded',
  (): void => {
    const tooltipTriggerList: HTMLElement[] | null = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const popoverTriggerList: HTMLElement[] | null = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

    tooltipTriggerList.forEach((tooltipTriggerEl: HTMLElement): Tooltip => new bootstrap.Tooltip(tooltipTriggerEl));
    popoverTriggerList.forEach((popoverTriggerEl: HTMLElement): Popover => new bootstrap.Popover(popoverTriggerEl));
  });
