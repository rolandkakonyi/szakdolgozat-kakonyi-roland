// Point object
function Point(x,y) {
    this.x=x;
    this.y=y;
}

// Contour object
function Contour(a) {
    this.pts = a||[]; // an array of Point objects defining the contour
}
// ...add points to the contour...

Contour.prototype.area = function() {
    var area=0;
    var pts = this.pts;
    var nPts = pts.length;
    var j;
    var p1;
    var p2;

    for (var i=0;i<nPts;i++) {
        j=(i+1)%nPts;
        p1=pts[i];
        p2=pts[j];
        area+=p1.x*p2.y;
        area-=p1.y*p2.x;
    }
    area/=2;
    return area;
};


Contour.prototype.centroid2 = function(){
	var cx=0,cy=0;
	var A=this.area();
	var N=this.pts.length-1;
        var polygon=this.pts;
	var i;

	var factor=0;
	for (i=0;i<N;i++) {
		factor=(polygon[i].x*polygon[i+1].y-polygon[i+1].x*polygon[i].y);
		cx+=(polygon[i].x+polygon[i+1].x)*factor;
		cy+=(polygon[i].y+polygon[i+1].y)*factor;
	}
	A*=6.0;
	cx/=A;
	cy/=A;
        var res={};
	res.x=cx;
	res.y=cy;
	return {
            x:cx,
            y:cy
        };
}

Contour.prototype.centroid = function() {
    var pts = this. pts;
    var nPts = pts.length;
    var x=0;
    var y=0;
    var f=0;
    var j;
    var p1;
    var p2;

    for (var i=0;i<nPts;i++) {
        j=(i+1)%nPts;
        p1=pts[i];
        p2=pts[j];
        f=p1.x*p2.y-p2.x*p1.y;
        x+=(p1.x+p2.x)*f;
        y+=(p1.y+p2.y)*f;
    }

    f=this.area()*6;
    return new Point(
        (x/f),
        (y/f)
        );
};
