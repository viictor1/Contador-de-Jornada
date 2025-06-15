"use client";

import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, TextField, Stack, CardActions } from "@mui/material";

export default function Home() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [activeTask, setActiveTask] = useState('');
  const [tasks, setTasks] = useState<{ task: string; time: number }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    setTasks(saved ? JSON.parse(saved) : []);
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if(!activeTask.trim()) return;
    setIsRunning(true)
  };

  const handleStop = () => {
    if (activeTask.trim() !== '') {
      setTasks([...tasks, { task: activeTask, time }]);
      setActiveTask('');
    }
    setIsRunning(false);
  };

  const formatTime = (milliseconds: number) => {
    const min = Math.floor(milliseconds / 60000);
    const sec = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const handleDeleteTask = (index: number) => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <main>
        <Box
          sx={{
            width: 1000,
            height: 500,
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 600, p: 4 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Typography variant="h3" gutterBottom>
                Contador de Jornada
              </Typography>

              <TextField
                id="task"
                label="Tarefa"
                variant="outlined"
                fullWidth
                onChange={(e) => setActiveTask(e.target.value)}
                value={activeTask}
              />

              <Typography variant="h2" fontWeight="bold">
                {formatTime(time)}
              </Typography>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  onClick={isRunning ? handleStop : handleStart}
                  variant="contained"
                  color={isRunning ? "error" : "success"}
                >
                  {isRunning ? "Parar" : "Iniciar"}
                </Button>
              </div>

              {/* Lista de tarefas cronometradas */}
              <Stack spacing={2} sx={{ width: '100%', mt: 4 }}>
                {tasks.map((taskItem, index) => (
                  <Card key={index} variant="outlined" sx={{ boxShadow: 1 }}>
                    <CardContent>
                      <Typography variant="h6">{taskItem.task}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Tempo: {formatTime(taskItem.time)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Stack direction="row" spacing={1} sx={{ ml: 1, mb: 1 }}>
                        <Button size="small" variant="contained" color="error" onClick={() => handleDeleteTask(index)}>
                          Excluir
                        </Button>
                      </Stack>
                    </CardActions>
                  </Card>
                ))}
              </Stack>

            </CardContent>
          </Card>
        </Box>
      </main>
    </div>
  );
}
