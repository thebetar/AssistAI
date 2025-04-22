import { createSignal, onCleanup } from 'https://esm.sh/solid-js@1.8.1';
import html from 'https://esm.sh/solid-js@1.8.1/html';

export const PendingNotification = ({ setPending }) => {
    const [pendingLoading, setPendingLoading] = createSignal(false);
    const [timer, setTimer] = createSignal(0);
    let timerInterval = null;

    const startTimer = () => {
        setTimer(0);
        const start = Date.now();
        timerInterval = setInterval(() => {
            setTimer(((Date.now() - start) / 1000).toFixed(1));
        }, 100);
    };

    const stopTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
    };

    onCleanup(() => {
        stopTimer();
    });

    const handlePendingRefresh = async () => {
        setPendingLoading(true);
        startTimer();

        await fetch('/manage/reload', { method: 'POST' });

        setPending(false);
        setPendingLoading(false);
        stopTimer();
    };

    return html`
        <div class="pending-notification">
            <span>
                There are unwritten changes to the files that are not included in the
                model yet.
            </span>
            <button
                class="btn secondary-btn"
                onClick=${handlePendingRefresh}
                disabled=${() => pendingLoading()}
                style="width: 220px;"
            >
                ${() => pendingLoading()
            ? html`
                <div class="loading-row">
                    <span>Recreating</span>
                    <span id="timer" class="loading-timer">${timer()}s</span>
                </div>
            `
            : 'Refresh Model'}
            </button>
        </div>
    `;
}