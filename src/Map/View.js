import React, {Component} from 'react';
import echarts from 'echarts';
import 'echarts/map/js/world';
import style from './Map.module.scss';
import axios from 'axios';
import 'zrender/lib/svg/svg';

class Map extends Component
{
    componentDidMount()
    {
        const chart = echarts.init(document.querySelector(`.${style.mapWrapper}`),{renderer: 'svg'});
        chart.showLoading();


        axios.get('http://localhost:8005/server/getGDPData').then(res=>
            {
                console.log(res)
                const {code, data: {sheetData, YEAR_START, YEAR_END}} = res.data;
                if (code === 200)
                {
                    const options = [];
                    let maxValue = 0;
                    //TODO:
                    for (let i = YEAR_START; i <= YEAR_END; i++)
                    {
                        for (const row of sheetData) {
                            if (row[i.toString()] !== undefined) {

                            }
                        }
                    }
                    for (let i = YEAR_START; i <= YEAR_END; i++)
                    {
                        const data = [];
                        for (const row of sheetData)
                        {
                            if (row[i.toString()] !== undefined)
                            {

                                data.push({name: row['Country Name'], value: parseFloat(row[i.toString()])});
                                if (parseFloat(row[i.toString()]) > maxValue)
                                {
                                    maxValue = parseFloat(row[i.toString()]);
                                }
                            }
                        }
                        options.push({
                            title: {
                                text: `各国GDP情况（${i} 年）`
                            },
                            visualMap: {
                                max: maxValue,
                            },
                            series: [{data}, {data}]
                        });
                        maxValue = 0;
                    }

                    const timeLineArray = [];
                    for (let i = YEAR_START; i <= YEAR_END; i++)
                    {
                        timeLineArray.push(i.toString());
                    }

                    chart.setOption({
                        baseOption: {
                            title: {
                                text: '全球GDP变化',
                                subtext: '数据来自世界银行',
                                textStyle: {
                                    fontWeight: 'bold',
                                    fontFamily: 'serif',
                                    align: 'center',
                                    verticalAlign: 'middle',
                                    fontSize: '40'
                                },
                                left: 'center',
                                right: 'center'
                            },
                            visualMap: {
                                type: 'continuous',
                                min: 0,
                                max: 0,
                                text: ['最多 ($)', '最少 ($)'],
                                realtime: true,
                                calculable: true,
                                inRange: {
                                    color: ['#6de7ff',
                                            '#8dffdf',
                                            '#7eff7b',
                                            '#f0ff61',
                                            '#ffb346',
                                            '#ff9645',
                                            '#ff8a4a',
                                            '#ff6a3b',
                                            '#ff472e',
                                            '#ff016b'],
                                },
                            },
                            tooltip: {
                                trigger: 'item',
                                showDelay: 0,
                                transitionDuration: 0.3,
                                formatter: params =>
                                {
                                    const {name, value} = params;
                                    if (Object.is(value, NaN))
                                    {
                                        return `暂无数据`;
                                    }
                                    else
                                    {
                                        return `${name}<br/>${(value/100000000).toFixed(3)} 亿美元`;
                                    }
                                }
                            },
                            timeline: {
                                data: timeLineArray,
                                axisType: 'category',
                                autoPlay: false,
                                loop: true,
                                playInterval: 500,
                                tooltip: {
                                    show: false
                                }
                            },
                            series: [
                                {
                                    name: '各国GDP变化',
                                    type: 'map',
                                    mapType: 'world',
                                    roam: false,
                                    emphasis: {
                                        label: {
                                            show: true,
                                            color: '#333',
                                            fontSize: 20
                                        },
                                        itemStyle: {
                                            areaColor: '#09C',
                                        }
                                    },
                                    itemStyle: {
                                        borderWidth: 0.25,
                                        borderColor: '#DDD',
                                        areaColor: '#EEE'

                                    },
                                    data: []
                                },
                                {
                                    type: 'pie',
                                    avoidLabelOverlap: false,
                                    label: {
                                        show: true,
                                        fontSize: '16'
                                    },
                                    radius: '30%',
                                    data: [],
                                    center: ['15%', '70%']
                                }
                            ]
                        },
                        options
                    });
                }
                else
                {
                    alert('获取数据失败');
                }
            })
            .catch(e =>
            {
                alert('获取数据失败');
                console.log(e);
            })
            .finally(() =>
            {
                chart.hideLoading();
            });

    }

    render()
    {
        return (

            <div className={style.Map}>
                <div className={style.mapWrapper}/>

            </div>
        );
    }
}


export default Map;
