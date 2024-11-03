import { observer } from 'mobx-react-lite'
import Text from 'renderer/components/ui/Text';
import { CursorPosition } from 'renderer/models/editor/types'
import "./CursorPosition.scss"

interface Props {
    cursorPosition: CursorPosition;
}

function CursorPosition({ cursorPosition }: Props) {
  return (
    <div className='cursor-position'>
        <Text size='xs'>{`Line ${cursorPosition.line}`}</Text>
        <Text size='xs'>{`Col ${cursorPosition.column}`}</Text>
    </div>
  )
}

export default observer(CursorPosition)
