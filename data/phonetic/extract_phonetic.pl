#!/usr/bin/perl
use warnings;
use strict;
use locale;
use utf8;

use open qw/:std :utf8/;
    
while(<STDIN>){
    my @word = $_ =~ /'''(.*?)'''/;
    my @prons = $_ =~ /\{\{pron\|([^\|]+)\|fr\}\}/g;

    if (@prons && @word && $word[0] !~ /[\{\|\}]/) {
        $word[0] = lc $word[0];
        for(@prons){
            print ($_.":".$word[0]."\n");
        }
    }
}

