import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTheme } from '../redux/settings/settings.selectors';

const CountdownWeb: React.FC<{ duration: number }> = ({ duration }) => {
    const theme = useSelector(selectTheme);
    const [counter, setCounter] = useState(duration / 1000);

    useEffect(() => {
        if (counter > 0) setTimeout(() => setCounter(counter - 1), 1000);
        else setCounter(duration / 1000);
    }, [counter, duration]);

    return (
        <Text
            style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: theme === 'dark' ? '#fff' : '#121212',
            }}
        >
            {counter}
        </Text>
    );
};

export default React.memo(CountdownWeb);
