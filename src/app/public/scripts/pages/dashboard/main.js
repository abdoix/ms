/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Dashboard.js	
 */
var Dashboard = function() 
{
    var handleDashboardCharts = function()
    {
        require.config({
            paths: 
            {
                echarts: iResponse.getLayoutURL() + '/plugins/echarts'
            }
        });
        
        require(
        [
            'echarts',
            'echarts/chart/line',
            'echarts/chart/bar'
        ],
        function(ec) 
        {
            var currentMonthNumDays = new Date(new Date().getYear(),(new Date().getMonth() + 1), 0).getDate();
            var days = [];
            
            for (var i = 0; i < currentMonthNumDays; i++) 
            {
                days[i] = i+1;
            }
            
               
            // Sent stats chart
            var data = 
            { 
                'controller' : 'Dashboard',
                'action' : 'getSentStatsChart',
                'parameters' : 
                {
                    'days' : days
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var sent = result['data']['sent'];
                            var delivery = result['data']['delivery'];
                            var bounced = result['data']['bounced'];
                            
                            var sentStatsChart = ec.init(document.getElementById('sent-stats-chart'));
                            
                            sentStatsChart.setOption({
                                tooltip: 
                                {
                                    trigger: 'axis'
                                },
                                legend: 
                                {
                                    data: ['Sent', 'Delivery' , 'Bounced']
                                },
                                toolbox: 
                                {
                                    show: true,
                                    feature: 
                                    {
                                        magicType: 
                                        {
                                            show: true,
                                            type: ['line', 'bar']
                                        },
                                        restore: {
                                            show: true
                                        },
                                        saveAsImage: {
                                            show: true
                                        }
                                    }
                                },
                                calculable: true,
                                xAxis: [{
                                    type: 'category',
                                    data: days
                                }],
                                yAxis: [{
                                    type: 'value',
                                    splitArea: 
                                    {
                                        show: true
                                    }
                                }],
                                series: [{
                                    name: 'Sent',
                                     type: 'bar',
                                    data: sent,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(77,179,162)'
                                        }
                                    }
                                },{
                                    name: 'Delivery',
                                     type: 'bar',
                                    data: delivery,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(87,142,190)'
                                        }
                                    }
                                },{
                                    name: 'Bounced',
                                     type: 'bar',
                                    data: bounced,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(231,80,90)'
                                        }
                                    }
                                }]
                            });
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                }
            });
            
            // Actions stats chart
            var data = 
            { 
                'controller' : 'Dashboard',
                'action' : 'getActionsStatsChart',
                'parameters' : 
                {
                    'days' : days
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var opens = result['data']['opens'];
                            var clicks = result['data']['clicks'];
                            var leads = result['data']['leads'];
                            var unsubs = result['data']['unsubs'];
                            
                            var actionsStatsChart = ec.init(document.getElementById('actions-stats-chart'));
                            
                            actionsStatsChart.setOption({
                                tooltip: 
                                {
                                    trigger: 'axis'
                                },
                                legend: 
                                {
                                    data: ['Opens','Clicks','Leads','Unsubs']
                                },
                                toolbox: 
                                {
                                    show: true,
                                    feature: 
                                    {
                                        magicType: 
                                        {
                                            show: true,
                                            type: ['line', 'bar']
                                        },
                                        restore: {
                                            show: true
                                        },
                                        saveAsImage: {
                                            show: true
                                        }
                                    }
                                },
                                calculable: true,
                                xAxis: [{
                                    type: 'category',
                                    data: days
                                }],
                                yAxis: [{
                                    type: 'value',
                                    splitArea: 
                                    {
                                        show: true
                                    }
                                }],
                                series: [{
                                    name: 'Opens',
                                     type: 'bar',
                                    data: opens,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(77,179,162)'
                                        }
                                    }
                                },{
                                    name: 'Clicks',
                                    type: 'bar',
                                    data: clicks,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(53,152,220)'
                                        }
                                    }
                                },{
                                    name: 'Leads',
                                    type: 'bar',
                                    data: leads,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(142,68,173)'
                                        }
                                    }
                                },{
                                    name: 'Unsubs',
                                     type: 'bar',
                                    data: unsubs,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(231,80,90)'
                                        }
                                    }
                                }]
                            });
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                }
            });
     
            // Daily earnings stats chart
            var data = 
            { 
                'controller' : 'Dashboard',
                'action' : 'getDailyEarningsChart',
                'parameters' : 
                {
                    'days' : days
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var earnings = result['data']['earnings'];
                            
                            var earningsStatsChart = ec.init(document.getElementById('daily-earnings-chart'));
                            
                            earningsStatsChart.setOption({
                                tooltip: 
                                {
                                    trigger: 'axis'
                                },
                                legend: 
                                {
                                    data: ['Earnings']
                                },
                                toolbox: 
                                {
                                    show: true,
                                    feature: 
                                    {
                                        magicType: 
                                        {
                                            show: true,
                                            type: ['line', 'bar']
                                        },
                                        restore: {
                                            show: true
                                        },
                                        saveAsImage: {
                                            show: true
                                        }
                                    }
                                },
                                calculable: true,
                                xAxis: [{
                                    type: 'category',
                                    data: days
                                }],
                                yAxis: [{
                                    type: 'value',
                                    splitArea: 
                                    {
                                        show: true
                                    }
                                }],
                                series: [{
                                    name: 'Earnings',
                                     type: 'bar',
                                    data: earnings,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(50,197,210)'
                                        }
                                    }
                                }]
                            });
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                }
            });
            
            var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

            // Monthly earnings stats chart
            var data = 
            { 
                'controller' : 'Dashboard',
                'action' : 'getMonthlyEarningsChart',
                'parameters' : 
                {
                    'months' : months
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var earnings = result['data']['earnings'];
                            
                            var monthlyStatsChart = ec.init(document.getElementById('monthly-earnings-chart'));
                            
                            monthlyStatsChart.setOption({
                                tooltip: 
                                {
                                    trigger: 'axis'
                                },
                                legend: 
                                {
                                    data: ['Earnings']
                                },
                                toolbox: 
                                {
                                    show: true,
                                    feature: 
                                    {
                                        magicType: 
                                        {
                                            show: true,
                                            type: ['line', 'bar']
                                        },
                                        restore: {
                                            show: true
                                        },
                                        saveAsImage: {
                                            show: true
                                        }
                                    }
                                },
                                calculable: true,
                                xAxis: [{
                                    type: 'category',
                                    data: months
                                }],
                                yAxis: [{
                                    type: 'value',
                                    splitArea: 
                                    {
                                        show: true
                                    }
                                }],
                                series: [{
                                    name: 'Earnings',
                                     type: 'bar',
                                    data: earnings,
                                    itemStyle: 
                                    {
                                        normal: 
                                        {
                                            color: 'rgb(50,197,210)'
                                        }
                                    }
                                }]
                            });
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                }
            });
        });
    };
    
    return {
        init: function() 
        {
            handleDashboardCharts();
        }
    };

}();

// initialize and activate the script
$(function(){ Dashboard.init(); });