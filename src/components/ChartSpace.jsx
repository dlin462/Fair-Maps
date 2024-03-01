import React from 'react'
import { MenuItem, Select } from '@mui/material'

function ChartSpace () {
  const [currentChart, setCurrentChart] = React.useState('chart1');

  return (
    <Select value={currentChart} onChange={(e) => setCurrentChart(e.target.value)}>
      <MenuItem value="chart1">Chart 1</MenuItem>
      <MenuItem value="chart2">Chart 2</MenuItem>
    </Select>
  )

}

export default ChartSpace
