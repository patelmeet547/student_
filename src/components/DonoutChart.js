// src/components/DonutChart.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DonutChart = ({ data, radius = wp('20%'), strokeWidth = wp('7%') }) => {
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

  const svgSize = 2 * (radius + strokeWidth);

  return (
    <View style={styles.container}>
      <Svg width={svgSize} height={svgSize}>
        <G>
          {renderSlices}
          <SvgText
            x={cx}
            y={cy}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={wp('5%')}
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
            <Text style={styles.legendText}>{item.label}: {item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  legend: {
    marginTop: hp('2%'),
    paddingHorizontal: wp('5%'),
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  legendDot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('1.5%'),
    marginRight: wp('2%'),
  },
  legendText: {
    fontSize: wp('3.8%'),
  },
});

export default DonutChart;
