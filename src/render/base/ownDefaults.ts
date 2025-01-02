import { InteractiveFabricObject, FabricObject } from 'fabric';

const TopRightAndButtonLeftCursor = `url('/src/assets/right-left.svg') 8 8, auto`
const TopLeftAndButtonRightCursor = `url('/src/assets/left-right.svg') 8 8, auto`
const visibleControls = {
    mtr: false,
    ml: false,
    mr: false,
    mt: false,
    mb: false,
}
const setBaseControlsCursor = () => {
    const controls = FabricObject.createControls().controls;
    controls.bl.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
        return TopRightAndButtonLeftCursor;
    }
    controls.tr.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
        return TopRightAndButtonLeftCursor;
    }
    controls.tl.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
        return TopLeftAndButtonRightCursor;
    }
    controls.br.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
        return TopLeftAndButtonRightCursor;
    }
    Object.keys(visibleControls).forEach(key => {
        controls[key].visible = visibleControls[key as keyof typeof visibleControls];
    })
    return controls;
}

InteractiveFabricObject.ownDefaults = {
    ...InteractiveFabricObject.ownDefaults,
    cornerStyle: 'rect',
    cornerSize: 6,
    cornerStrokeColor: '#5C8FFF',
    cornerColor: 'rgb(229, 229, 229)',
    lockRotation: true,
    padding: 0,
    transparentCorners: false,
    borderColor: '#5C8FFF',
    borderScaleFactor: 1,
    borderOpacityWhenMoving: 1,
    controls: setBaseControlsCursor()
}
