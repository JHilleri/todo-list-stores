export function setTrue() {
    return () => true;
}

export function setFalse() {
    return () => false;
}

export function switchState() {
    return (state: boolean) => !state;
}
