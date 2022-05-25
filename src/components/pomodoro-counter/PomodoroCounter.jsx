import React, { useState, useEffect } from 'react';
import percentDiff from 'percentage-difference';

import Button from '../button/Button.jsx';
import Counter from '../counter/Counter.jsx';
import StartButton from '../start-button/StartButton.jsx';
import Progress from '../progress-bar/ProgressBar.jsx'
import './PomodoroCounter.css';

function PomodoroCounter({ HandleSetAppStyle }) {

    let [minutes, setMinutes] = useState('25');
    let [seconds, setSeconds] = useState('00');
    let [initialValue, setInitialValue] = useState(25)
    const [progressPercentage, setProgressPercentage] = useState()
    const [counterInterval, setCounterInterval] = useState();
    const [time, setTime] = useState('00:00');
    const [styleDiv, setStyleDiv] = useState('pomodoroDiv-pomodoro-style');
    const [startOrStop, setStartOrStop] = useState(false);
    const [startButton, setStartButton] = useState([{
        content: 'START',
        style: '',
        active: false,
    }])
    const [styleStartButton, setStyleStartButton] = useState('start-button-pomodoro-style');

    useEffect(() => {

        function percentageCalculator() {
            const value = parseFloat(`${minutes}.${seconds}`)
            const percentage = percentDiff(initialValue, value) * -1
            console.log(percentage)
            setProgressPercentage(percentage)
        }

        if(!parseInt(seconds) && !parseInt(minutes)) {
            
            setCounterInterval(clearInterval(counterInterval));
            setStartButton([{ content: 'START', style: '', active: false }]);
            setStartOrStop(false);
            setProgressPercentage(100)
            setTime('00:00');
            setMinutes('00');
            setSeconds('00');

        } else {
            setTime(`${minutes}:${seconds}`)
            percentageCalculator()
        }
    }, [minutes, seconds, counterInterval]);



    function HandleAddTime(minutes, seconds) {
        destroyInterval();
        setStartOrStop(false);
        setInitialValue(parseInt(minutes))
        setMinutes(minutes);
        setSeconds(seconds);
        disableStartButton();
    };

    function HandleSetPomodoroDivStyle(style) {
        setStyleDiv(style);
    };

    function HandleSetStartButtonStyle(style) {
        setStyleStartButton(style);
    };

    function disableStartButton() {

        const newArray = startButton.map((e) => {
            if (e.active) return { content: 'START', style: '', active: false }
            return e;
        });

        setStartButton(newArray);
    };

    function HandleStartButtonClick() {
        const newArray = startButton.map((e) => {
            return !e.active ? { content: 'STOP', active: true, style: "start-button-active" } : { content: 'START', active: false, style: '' };
        });

        setStartButton(newArray);
    };

    function HandleStartOrStop() {
        if (!startOrStop) {
            setStartOrStop(true);
            startCounter();
        } else {
            setStartOrStop(false);
            pauseCounter();
        };
    };

    function updateCounter(){
        setMinutes(parseInt(minutes) < 10 ? `0${parseInt(minutes)}` : minutes)
        setSeconds(parseInt(seconds) < 10 ? `0${parseInt(seconds)}` : seconds)
      }
  
    function startCounter() {

        if (counterInterval) return;
        if (!parseInt(seconds) && !parseInt(minutes)) return;
      
        setCounterInterval(setInterval(() => { 
      
          const secondsOver = !parseInt(seconds);

          if (secondsOver) {
            setSeconds(parseInt(seconds = 59));
            setMinutes(parseInt(--minutes));
            updateCounter();
            return;
          };
      
          setSeconds(parseInt(--seconds));
          updateCounter();
      
        }, 1000));

      };

    function pauseCounter() {
        destroyInterval();
    };

    function destroyInterval() {
        setCounterInterval(clearInterval(counterInterval));
        setCounterInterval(undefined);
    };

    // function resetCounter(){
    //     destroyInterval();
    //     setMinutes('25');
    //     setSeconds('00');
    //     updateCounter();
    //   }

    return (
            <div className={`pomodoroDiv pomodoroDiv-container ${styleDiv}`}>
            <div>
                <Button
                children={"Pomodoro"}
                HandleAddTime={() => HandleAddTime('25', '00')}
                HandleSetAppStyle={() => HandleSetAppStyle("app-pomodoro-style")}
                HandleSetPomodoroDivStyle={() => HandleSetPomodoroDivStyle("pomodoroDiv-pomodoro-style")}
                HandleSetStartButtonStyle={() => HandleSetStartButtonStyle("start-button-pomodoro-style")}
                />
                <Button
                children={"Short Break"}
                HandleAddTime={() => HandleAddTime('05', '00')}
                HandleSetAppStyle={() => HandleSetAppStyle("app-short-break-style")}
                HandleSetPomodoroDivStyle={() => HandleSetPomodoroDivStyle("pomodoroDiv-short-break-style")}
                HandleSetStartButtonStyle={() => HandleSetStartButtonStyle("start-button-short-break-style")}
                />
                <Button
                children={"Long Break"}
                HandleAddTime={() => HandleAddTime('15', '00')}
                HandleSetAppStyle={() => HandleSetAppStyle("app-long-break-style")}
                HandleSetPomodoroDivStyle={() => HandleSetPomodoroDivStyle("pomodoroDiv-long-break-style")}
                HandleSetStartButtonStyle={() => HandleSetStartButtonStyle("start-button-long-break-style")}
                />
            </div>
                <div>
                    <Counter time={time} />
                </div>
            <div>
                <StartButton
                className={`start-button ${styleStartButton} ${startButton.map(e => e.style)}`}
                children={startButton.map(e => e.content)}
                HandleStartButtonClick={() => HandleStartButtonClick()}
                HandleStartOrStop={() => HandleStartOrStop()}
                />
            </div>
                <div>
                <Progress done={progressPercentage} />
                </div>
        </div>
    );
}

export default PomodoroCounter;