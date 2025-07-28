// src/components/DonutChart.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';

const DonutChart = ({ data, radius = 80, strokeWidth = 30 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const cx = radius + strokeWidth;
  const cy = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const renderSlices = data.map((slice, index) => {
    const percent = slice.value / total;
    const dashArray = circumference * percent;
    const dashOffset = circumference * (1 - cumulativePercent);
    cumulativePercent += percent;

    return (
      <Circle
        key={index}
        cx={cx}
        cy={cy}
        r={radius}
        stroke={slice.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashArray} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        fill="transparent"
        rotation="-90"
        origin={`${cx}, ${cy}`}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Svg width={2 * (radius + strokeWidth)} height={2 * (radius + strokeWidth)}>
        <G>
          {renderSlices}
          <SvgText
            x={cx}
            y={cy}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#000"
          >
            {total}
          </SvgText>
        </G>
      </Svg>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text>{item.label}: {item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  legend: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});

export default DonutChart;
