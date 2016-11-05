{
    Gastos.load().then(function(data) {
        console.log(data);
        Crossfilter.add(data);
        let stakedBars = new StackedBarsComponent("#stackedbars-container");
    });
}
