import { Dispatch } from "redux";

let dispatchInstance: Dispatch | null = null;

export const registerDispatch = (dispatch: Dispatch) => {
    dispatchInstance = dispatch;
};

export const dispatch = (action: any) => {
    if (dispatchInstance) {
        dispatchInstance(action);
    }
};
