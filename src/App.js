import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { Button } from '@mui/material';
import './App.css';

function App() {
  const [coin, setCoin] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [amount, setAmount] = useState(0)
  const [costBasis, setCostBasis] = useState(0.00);

  const handleCoinChange = (event) => {
    setCoin(event.target.value);
  };

  const handleAmountChange = (event) => {
    debugger
    if (event.target.value > 0) {
      setAmount(parseFloat(event.target.value));
    } else setAmount(0);
  }

function isDate(dateStr) {
  return !isNaN(new Date(dateStr).getDate());
}

const applyNewDate = (value) => {
    if (isDate(value)) {
      const dateString = value.toISOString().slice(0,10);
      setPurchaseDate(dateString);
    }
  }

  const handleSubsmit = () => {
    const cryptoPriceApi = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=USD&apikey=B51E4JGUNRQKOGTH`;

    fetch(cryptoPriceApi).then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        const spotPrice = parseFloat(json["Time Series (Digital Currency Daily)"][`${purchaseDate}`]['4a. close (USD)'])
        setCostBasis(Math.trunc(spotPrice));
      }).catch(e => {
        throw new Error(`API call for historical ${coin} price data failed: ${e}`);
      })
  }

  return (
    <div className="App">
      <h1 className="title">NFT TAX TOOLS</h1>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAAEaCAMAAABtrpZTAAABg1BMVEX///9mMwAAAAD/zJmZAADSaQD/AABqNQD/1J//z5v/zprnuYv/0Z3/1aCeAACZmZn5+fmfn5/f39/YbADIyMju7u7m5ubc3NyAaE5gMADU1NTGnnXz8/Ptvo6WAAB7e3sODg5DQ0NeXl6/v79ZLACDg4OPj49mZmY2O0A0GgCrq6uUlJRcLgBwcHC0tLSpqalOJwCLAABTU1OORwBEIgAkEgAcDgAZGRlYAAAjAAApAAAWAADXrIEkJCQxMTFoAABMAACDAAB0AABtVTovFwA+HwCwjWqbfF0sIxpZRzVDAABOAADhAAD/0wAdIiQYDABENik3AACzAABiTzvRAACyWQB4PADCYQAAAAg+FgChgmIuDwAyKB6KbU/VAABfAAAvAAB3XQClUgCpVQBaIgBOFABIEAArDQAeGRI+LRsQHCQ4MiUqHg4AEhI2IQBMNRkKKR4ADhsAAH0AKgAAAN0APQAAALwAAFoAAEI5KgBARVHOpACScwAYFgDluABtJQCCMwC+e3e3AAAe5klEQVR4nM1dB3vb2JWlLmkBJAH2TrE3NRbRomSZRZYokZbtSLLpJlkcOzNJRjMTz6w3m93sJrvJT99XAJAoJMAm8nzzjcUGHFzcd9u778FkWjg82wnxT5c/6Cu5c4nq5keg+NisFvPbPv/iaRiGK1NAxIqmYGmnWL0kLI++3Oxnw2sCwtnKzacj9PZmrhRYNlsEV6kKcBMOQwpxekqYMhRrwyDvhCs3dYDC9nJ5Z9KIMCZ0ldwKq5mqgInvH8HljmdJhCMJLGGBph5bGe/sJ2i5Nx6c8Ib7Ej7tGmeq5J39AsXggzKOFKBemZawSPsGqpEHY5xpDXRiJtYVqD7MeCx/hBlFPMT6BvKLZ+yEenZOjAnrMFwuWNRueBqeH2HK+hxKC2ScOZw7Y0w6C85FMQ5Un67NnzEmvQvuhTB25Y4WIGOJ9CLUo/z0D4tivEbUY+6WuvT8jwtkjElXYL7WI9J6vVDChPTN5TwpF+uLGXoK0vX03BhH7hesFhJgZ06Ud44ehjAZh755MPakHkrIa8Qhzp4xbiTqD0aYkK5vzkrZCQ8oZArIzcTYvwkL83ujgFQ6MwNlH3x6aMaY9P4MKl1CYf3DM0b4lJqWchmyS6BcIeWcKaOl8sOrMiGNMvFIZLoSQgmWQHhtpkDJtyTKiPRRazrKgaVRRpguy3JdhfUPvSighGWa2D/1h+VRntJA5x7cXytI/zixSme+LJcywqSFJX996ZRRzOGaiHNq2YzXsGeZqNix86elixkPw0my2QCsAGUEmKCWnlqiZR4CUzc+CjPLH4AEzP6hYc4fd5fNVkDYcKhUWhFtxpZj2yDn1v7KcP5U1CPrSeLLWmo4p0BF39olcEKzOqqBYMAVwidIJX5cHc6MgYg0A8wNnK0Q5yMDg7D6IxO+ulpK4qoF5iahz3kDsgwKt8+XTVZExUiVo4xGILO2v2yuIsJggLMpdYMUY+omAY0mk5nAGMqwIlObZ2b3vIbrP7V9g9ds4AqNGA6T6XJKXWZ2a4gtilTClQMw5EnD++cYlWx4NHGmbsBwFKbzKMzaFmwJXREMs5s1QhmuzrYQalf41owwVcwX/bmVDEwVOjMVqE1sIMOi+jPhSg2ZKq3fGzB2LnRXp5Hz2YwVX3TSc81DMPu6E2+Jevhsa9KzM+guT+2FJBExa2cHGkfRNdBBqANMGvCjnH7iyxz8uDbotEEKpi52Z/UiuyLkfJOOQXSmmeLts4E6oqtXjabwVz11njzlRo5+RlXePZCOgK5f9bkBRzghZ+Z89skLxPRKOAizVVMebe6c50EZj8NzOKOmjrk6V7SXGuAcnIQzUoz5TBEx4TNhVIQVR5w75935TcQx2askZovEIP9g3pyz88zQkVqfIQPNnMlUOmygLDMR5/m2oOCYBds9me3cNTBbPxlnei5mXnEztntZJjw8DLPVqTjrcGKEXn04uqlk1zS+xqyFEbQ+0ThYRbQg4mvdqoyWrQsjOlcHta3z/Up2VytQ372CTsxub0RvQ9dJqD+9qYSHv4FGFSSFi9Jvk2bWasPOkLkx0BShYZ+ZcPjg/PwMx7kE9R9vEH2xWx9fxT70zKyV4ziWMzei3fYdEfquwDy8BdcNHn90ew1PdTt5kbEekDaUeA9VvphwNkvPytS2aJz7PNaIdrqh3sWdxJ6S/wRR3kxgQ8xZawwJ/RfCnCQh55i11cqxsc4v8EmnnVdm7ioFfc7+wfdpcneOdXTrgBr8j/jEmBSSGqHfvqbcz88hZLOaJdgQP9bc6ITwxZ0h4vtwYWfRBxxrDwGMzxiHSRsZgxvS10FCbf/8gN5lYM0yXhxLtQHLFJJ2m1kGG5Y50ogLrMv7P0LfaiU3wtZ5jhMxQmlXXLgwfBHM+YH4MmxkllBQJuYMZNjCNxlxtqlAmPMc0oYup/4UC5xn7Z3QPTrIfYMlX+H4xgWcIbpId7ewyNHZzsXxSYZITSrAfTTOeRdUuNqqALIPoxCLjf+wcdtLQicqvo5eY9a4u+QcscTGiYT/SC+I4uB3yVAyUpShnJktItwrNfOpQNZbfUweHn6Uv39GRVNhaGvMFXaD6Jz7+JaeHWxh3TAy33ZIOR9gBWWunkfJTZ0VCbeAckvzcxQ/b9G/zulA2kc5CwDSaiNj0NQayHm/Ag2et3c6/eSspJ0C3MURX6iFa8Jf51nyTwVLfpfZN2CfTZvCGKxAjYEQ30AjB+zPs9n9rdqI0xlBwemmpHdGfmVweKqRV+ifNeaTkX7XTSHvxouhIMbfd3m+l7yvEJ9Sad926WFzCYJiutoydA+SuSoijf+b5JahsxopmptSUt2K+dRjbXZkTzsAWSr7Hs+HCAX5b/we3/b2dtm9k8vl8vk8Eme5XEbvZHy+SI6ePt/MI8VIugXO4yMflEsfIsFnkTsz1KKblqJXBqKcGbkJK9IPmvBk71lOi/M4bFPOxVzTvQNFt/uQvNTrndtA38EmmgEja/VynwacqWOz2SFJQzUGzOyknAUFLribxXzK7XS3DHEOYAXHRAz1cJTqTFbkHKPOOAZdUcNiE3Ou0h+m3Tkg+pwiL8s6v4rgQYg4Zw3V+QOwK4SjDDREzjwKiaIIDevEugEiZ3cqhTlTOes1DGTwSdCNvTFink2mZI2OOKrPWKFjgKMEK4LNPJbzRkA1k7AhcXbu5LCBbtKXOj8no6CeZZ4a64bYgUtaM2R+DCHO9hhrhkHANoZzBN/2loJ1ZMCZOhU6BjVueQZfTVVQXzf+TgJuDHb2b4BYZ6wARyj2wGzT5+yjZBQ3s6TkLLxWdcAIXxSMILGQpmDKkDojBExDyhFrNBpRMBuQcwq0JOgccM4hC+0UzLW6913wNUK4TFw8krnxvsDqDVWO86QZKzJ/FzPAuaXJWeSYTuP/p5wF0PyaNFYFzlVt/RkDp5jIAvKEyKlElZy1DidIVGHFpJioHeOs9j5ciq+VfWgJ+nZmIIDkRJwjYuYbhgszSk2sSt3Q7LkpNVspp/JmpgWKXR5dvI21DyJb1TU3m9Wy2KeNNWXC5nix/IRCb+g3zJyKs55PkCC4lDshkbSaJdLjDkEspJEodAgJqfMLV1Sgzyk5N40eSRiZDfFWWWMjBT0EYp4n7Ocf6jDHac61irPR5SOCS+nxgwNER2n0EA5H6d84DBeWUfjf4ZScDQ5qwWwMVxBYKXgZ+audiW6liMTRgPP+OVyzKs4G6juSF7zlZKQvdARNfzXxgrxBdwFT+dgO9a0qzoaaZuk3k1ZFsUY8hHZs7KcfTt5mnhwoB0pkh/RZUkf9aDwgGI0OJ6fMNcRDaEUTngnuoxxO0XKg7PWeyslGTs1Lgm6OD8c9osu7U1BG2nErHqOgas8Q8pppFqhsiDWwc/hE9dFmv43J7uxY4+GrSt+yW5Wczbw0DqGZHw6XPOLPplptVRBijk+h2x4dQyhd4WR3FqfTmnvwBPND2bVSM5Sk0VGKGXoUj+Tpk5MFGwIiNOZgtnq43E21ostjkbFRkCFVzJdLvkjQE/AjREqJw+FPu7wGZXSQjvwgKFtMDNWY7BP28gu4rFDd6Al2zoaUItTgWKuNaxivh/W1KSPS9jEHsdunWz5YJoJm9i9E23wHRSSJUNTGstbu6PPJ0BlFGXlxbtRBrmP8naEagQouGvlXBM4cXB+UTaTE0o6aeWvnTp/xtZ0dSZnYoa5GVSnZwfHvn9NTrZfOEXOXFTjb7Dw1p0FAY/unrp2P3V6PZRxqsLYxlIkguEZffu29KMfiInysNtWiRz/g0rvIGeszsZklFAhEnIh3r2M3k0K4hqx63YaVVds4LQ3B0y63/RBCv9Ow8rzZHu0i714oTbXmMVev1ZisGGvYYtT+tASnHSl/Q/LuR+32Rid0cXf3nOC6jc4cQ7IyQnjAm8fAbHtoZD5vd/rTroZ1IYntS5ytjZ/xmwFpRG/ARqCUQMnSQfs2areS0+IZrQno0tkYDkmazoDd97pRu5nl+P6EAf8AJcjDgHOUlAF2pGJAiU75uyKlr1gfvl5QCSPSemosSJfjbfboLZ4Bhbse/rGZ/Bj9mv9p+uXdLj9siZy5Dqk9NKWjJcQajwfijvjJ8TO8yRv80u5GG+jkI8CZYwKi3fY9lqx0pVbb4Fphlj3AClLsjCO66o5v0E8htZ8WjxwWi8WBED85/fyCUL/o9S4EXCPc3T9XupA7pFExq6YucdGZ9isIDtLPKBw/hcF2eREpJIBTzJkCM3dY9k5OIdRBiA6jgSHUWs1WIllttWF/M7ouRRvFP4t2owGIDVIBQjxRSoiloAxY1HBAFJEisMpgFuY6x43M2HTRxgAgxWUQFwSJmL9AxKtlYkLSLx1anBuGRqIWuL6Bpo2xqIpFJPaXk2EVEIh//UouRYk9GEtrHGy2mfcbckeFMcJ1FAIloy4e39OgbDn9Ojo60hNzZ8oF6QN4xIqMjTvSUAJtOD6HtEJ9Q2DPZtl7g0IqFHDdE322Auej6ATOWwZr49vMlE0JqS8j9sKooOMwyo7pgv91Drv2RKRyHdvTGm7zVQ0uOpctnZribbY1XhBTp88ZlD0zxjGrbabYkVJn/uIZ1F+e6NF2POmNS1DGgf9tPvuqbUhuxWZ/vf72FIadtRb2xNnQySm357VTYEESNNs/WV9fdwDsjWHtgNspxcy2Z/WAEoIDp8b92xtEev0ETkaSdry4mJIy15t6sx41NkMiCxS/vMWk32gFRpTy6bRum+3N7ACHEIGGqB0ojKak69qCduyRKedpKLe/zcVkiGgNZMd2gKjHi2dapB1xmNJmoOPOd4Pi1NCUCN+BU8T5lZb1QFLuTSdlrjGHDeBkqHagK4mPjUL9u/X1U1BGdA7Lk1E1RV3KsemqXWNQiJqTncGkSuwajl+tgyz8cDj2nsDX6HSKgSjPfY/ORIe1XQ8Khja28xU+n4BDhGXv9CUuXFmnVAz7/Cmb8ihOYkOhQQGO46I9lKW8ePns2bPXR3B/Heo0UFo6nfvjo/PZgVEON47T+M51bCBHKy60dRE6UXvMcCVGDRtnbi9Ayii3Jq6Na1x1hiuHNiGxnjqGw8e03kJqIbuwR2jFwGoL3TX4aTMQNdC9ujU20zgFAmJoxzbgosFOnesNg2O5RgiguKit7l2SH+R7ic1ax2youDwaeDlCFM805hf47AmpxML1d/DkXztqm9JK4NUJsWj/J4BWfrE73G+KITTXwbO6G+5NuOjY2Qlr40gdYo3b9hWu+mUW+fiDQA5P+IlJqRXPDqaRn/VvVwHanYaZHVMtxLCZ6XKbWKPT/w39uJUoR+YawKmxAymnz7T9k1hqtEPAvy30mgXd6Y8AF31kos2khqwoKJK1LGZMtn2GZFvIb/se4tEBiRQ5iweEOR1hKigtZRQbke1c9Wckv58uQl158RYvukGSvUznyj7PSNFupGar3CoRKApV5gj8uU9tHP9nUppKKJqg/JGMO1esbspQdJb0t9ws/9r9eX7S9xQgITYlBHIAdx2OQ4aD6kUBkoa7v8ai3OdD83LenjSkPEieYvjicgNcdTi+I9TTWs70XE4V+Y3n7udSiUGMm4Ste6j5vtSCu/434W77wZ/Racw3BsBJyuxPyPBU4VCsqPpTQ5Gi5xIOxSaRnYLJVZhp02OKVIdjQ1M1bAwhkB4wxtgeNGGR5jN6CQGiGT6ozuocnD+hZGK2a/cX4VAxPR4QG8PTdJ4Mk94Q47H8rIGZBwUGXCdl8gkLnCaO/zcS0NS45GoSBzOpL08QTh2wjbRZmt4NbM6YZjTbLO66q7Up4OfJhnYOWtrnd0LG34T4OsErqMJwzacEqVnisxLgeaYYnqcls+YTpVruMQ8TCmKlOF4XSSv663KzDHw/RPG8odlut+O29m7b+BbsGRL7jEYJ5axv30ic5TofSE1rrAPpX+3IVcViuEfyslpI5N1Gx2Ow1dTxoHSVAa7WvcZ/KBs6M1CYwjGgEY+bebgOoLzd3v42wXh2FfX3PqSccQGa/KFuschP3I7jykEbt4SjCLeDGwtY+4VhXS5DWl9GlPNTUc4aCuyvKten6J221sCFHtzWyVujDdZs4zvGLjx4aOzi/KTNF3F+ghhra69vgh5gXxJucYBr5WO33X6f70LIzNnYqJFe0aLxYYpF/Wp9/Vha/KJmvmNwg01/FXqkxMM3LjbThXSIjcFH6MZYvq1rgjIai3IGUBgSvEYO6nUg630w30O1TBAZA+N+B66IWuAq0ibSy0ybZS+KkU18Ah0D5EqPETKKPpVnH/S5FDJ4FBa1+pR9cKijaz4kURSLo4SsI6yg8ADLRVFEuhHUq+n6IDlSyBt5SLWU8U9C4vzv8BfAo0jzt25IjRHWRhouYiwibO5cQV4Y/GC3ckZuUG60kDdyOH4uKGdlkF95enrqOAL4D/grbKBBqc0N2c7qKIGVAaK8jbN2LgCckrkqtHn2QtdkbLRGao4rD0l8zQGlrvuo4fhMOUdMrpEjzpOCgpYB8LSgb0PmASlFcpiiD11IW49zZHSS4ZQ8c1UxhoPUcOwB/Od//fUvZb+pNXo4oHtSVJnrHOl8xTMFTQXBKkT1OJdGKs82DIQXUegrXiTz5m38FOBvf8P1FX9Onh4MwwXuKuRkvgrdpijy1GxDLmP69ZTeUp2dUdNEGXlxtamwAIjo3ts4kvN9AoKAW17do+6XB7nKYHXoaCgTQ14D+bpb7TQhMp5ybsQyG6SFcm0oKUZhCwV3r+IORN0EJrcLKYvJc6ht4TOAGwiDKVF6GfgJN0Sz9t8up4m2cyNmaRNQUB5OMU7xMgGLxfFUXPTiwsqjbX/cKdr06CMZAfIEJIAzh6Z7QJFbW8oZaKoNSU5+5/FaqBOL46XgrQImMnsagUO1ZUuXxMHghu0IDuBwa7n2Shpd+DQrIK6q5pq+gHwU4pXXTxyWUzxOXdutQ1OTyBupqrLzwtX0Sz91peooaOPw1gfTVUT8mlOemVFJvzwVICmWw4ESlWoBUkhTW8LBVDlhLjN0uakOa2Wjz6E1ZTLT1HIDiZHOwS0b47iRG/bi69gjEI6Sk/ZvykwVErJH4uwBO2+/hstpixg7Go0drlZyZNAakH8fF9BP365/Edf/DS1wyA+v7KqWBpyDcG1ta9YgjMGvYZgD2ovxBTRlOoPLMnt4hl4IzYtDTCKDAYadkcg534QepGaogSi9MaE81vrkZUMzjwch6Uminiwn06mCmCbiQjjlXKr6tiE9y2OYg+rgMaBTm4jIlAMbDhQmvRXXwuflLi1Do1sy/BDnjR2sOzNWx6qqfM2la+NlptFDOa+L6+XcigtGwTF6J5EgxIsFfAG+2YqefrVpruo2O7ZkgwdoaFcXBmFZVTNArilAzalgVBNTr9wgcKpyoZK+EHKyG4GXzL1Zj78QPGFG45LdTbqIQAiwlHHWhFAnagZcaUmm0DjicKw7PgvxX0QrdBFi4wTV49ke+bqhEmrZQBueR/arMjbQ629OhL02Ahr3SYy6t8ld1Rj2kyCj2p/FyH1zyU6KvXfdEY8DVWiXBqOCoEzBJP7/9mytfnml1fAbkoHcDRHvbXHUBYVWj2qX9H0S9BVmezhmQek+fYY6NOWJP55TOXY4ngkK3VJpa1m6myms1zNOE7WU7ihjaO13UXZWnHu/cDiOBYUuqLSrKuV67hQeDbPN/aliDS1LpYZT7sdIOBp/Iyh0XhUQunKH1UQ54sdjPmDKz9hsq7pkX9LIz0pyjSwQhX4jVNa2tTw/WckJzWIyHZz1MeIqzgFDLY8+uQaViEK/OqYK7RuVebgi27l0a7ol8UNQt75WjexO5ZFbKz8t9zuoQgfn2GitBXVS7zKyN4w/qTgMwNH6+ndUoY2Zy+mhnGA1Ye3QN0VKv5GmYZKg0AvmXNWIsIIGolvFOMiRMAlXGp3qD+eNHS2ZRPSn2RVRTpkodPwJVeg594cr4dGs3noO9USt+JmPKLTjlCr0bGGbPoraZgIJzjlOWooqJplWeePYowo99w5xJUaVyd3oPpdGlv5aivuAOZ86cKXRrWWM5gzPyFHuQ9bgMFGSCAyPrLRi7LZIBczxhez4t5DuZRnyY6KiTE7chY5g6EcKlcK5ylMS2oFHe4zMFzrjrQTBSMTj8biGA6qSYmt/bDjAgkM7A/N5c4BnvOcbuJghzsoEihQMTsggfBDOSJJjFry5B9WOYZ4yzu402eYGxf110OqKWAS2x+zyBDnxMxdoIJXzSZOxLx2WkxPLE5hwF8IpERk5xx1MRcTQMnIh7eEg7vsd63T78E3cE4ssuCI6PXuPnQG4qpDQjBKqAb84b5Hv8GRZxNBOFHZosPwt5CQ5I5zAiC1O54+M5noFLGQx5Gn1uwrcdvFKMf6acH7xhC5CxjWDBUccA7iHZ5sF4JMLheIN2JYZa3je63RCPO7oL9P5CUr5DYruDD8TdXaUWlCUVwGwzXBSn5cZTj/KO5sNnudtZHK9X8YJobCmPv4K54ULTlVkCDibkJNoB4haCIWrxLBBLOeRPtQv+Bj0rFzfjXeQ/UzkHN97QzqqHqLlfQB/qQDpbeI+itQ0U18isyz5vMnjCSTt3RB0+L4bx6KvCee3KF15BgtbyzMGnnL1sFD2CY6PFH/kWV4Bu87gr437zl2Ub5eJ6Sac1+nSaZjn6lvjiDhFT0Nq1PJqJKmal9uNC/6e7KGVJBUOi2XvldDU+MDKIcIFkYBvO1+sNrGIE7KghIT1+X7jmgdz9BuN644dFgdZgkwU+uGVA4O0GqWK+VIEM5TNF9LBudONXpuB/81Hd0185hC6dHG7nXLf54eBH6StuQ/diuL6dhL/v9TuQR9+xU5PqEF/RxtecV644ORbG7lBypermjKyxKRANb1adKfcdJ0UZrkXf0VWp8cJ5wWsDtXFUFTvA1NCPlWlirjpRBBB3ELC6NkXPkyMzHClEIKyzUP96igQKz9emb7+9o3FQsPoh4o5BigOizKdUEy9qr5Oti7FlPdwpKTZD714QD4S9IvC9clNV04dTpA2jldEMywOEnJAU7XJ9qIhbpZ+mEonEjl5maWlIUKgCv0KecO40MS98DqHBlwuf8AT8WXKTuVchIZNwHHq8bojjsOkV8RCT7Bj+OIR0bK9ZF9pZOcscewL3xLOc9tYZXaUtQIgsrE00Yw31EifTLE19uJQ1DK9ZGfpU5HyW6QjS/KF2tBouhMeD/HCYRF9oQUX7x6gOGMQWuULuhv2sSNOotHvMOeXU+28uhh4NNVUSGOJlKlj2dN48sWyUNI0B0WSxgormeJEr5cUkGohrxnOY4X+bHFQzjiZfbv+QEUwI9BujMN24/UbaueELOvzNBvULwYjArYmDZIEQ2ehueyKGA5PUvt9HKC8pdEoVufviDN8uHrSWLhHGANc4yAJ4R6JOd6SXHZFDEdqxEwarnE8E43Gd0L+/ZA1sNHwj6SRogpNNIMq9osVMRz5kbnpDlFoqhmU8/GKGI7RsVqEKHTcQqNRrCVPVsNw+Mak04jzF4dFFo2uhOEYtxIZT6vEcQSN1fm7uAMnKysQJbnGPaYcV6GPTwWj8SruOFkN1SiNq7QEhdkrrBqWOJkMWgExm8Y/QYFm28c4hEbx84qohk4LjPgkmpc4ssMThbP1Zs8HWj23Q4gUhUeeIM3YO14RMavlPLBlLpywKh6r+yDzsXpw40ZeVyBSFirog1mWDC6EBqAKRWkWUXN90RJQBPqkHGemVCpt5y9FlfVAKuAJJAom6eFOq6HNGHB4trsb3j+rw+sjOLoJ1/4bivl87n/gAKSZH0/e7VwhzmX8nGSMbM3LnOGn2v7u7//4/e//8ff/3UV/f5DUHQemqeVMXakAV1BDOKhB2Hte2zo7g99RECl/GBSOVA3sS0MJHn3/mMLr/X7t/fvH8H8Yv/s7vHv37sP3qxEuy9FivCIePSL/VITx9gN+4/1qpCUyRODDIwUwefEf7x9XqHgronDjVXImfL3vyLV468uZfB0HP3yv5Iz4fnichS0q/6XMCY7HDqgo/8AcwNX7D/T9D6uR/ckA7xWcvVvw/nxNUGl0AatnNjLKEYhNxSPpTa/38cqUQSVU9+Vi9j72PvIy56KUv/f+cwnTxeMRUI7AD1hVpDffvfe+XhnfJyKnGIHe8AckavFNL/POu3pDEB4rRiBSFe+V+Ka35n30cdkUlUChhkKbEd130psfst53UzwOdbHY3FWoxj5WD0YU8+PvvY9XaKqYwAPv5HL+sIZHoGToKo+8/1zClPxYJJ4qxPz+HRLumfimN+v1/mnZHBVwKQ2dF4/Ac2lY/oDi6VXzKGVlqIFIovhCUo33yEDP64ky88Lme6VxxuPuQFINlAv8axXqiUMIqIL9LDbO0oV8QKrxenWaCAicf1KGGj8gZRioxmP010yPNVwANpUjsILE/H5gNVA8+v2KBUgB5QjE4ZF34MyxavxhxXKUnX8pjfOHR0N+G7/0rlBPDME3xQD07uLIuTLkUB69WzF19v1Rwzh7SUlDUo1/rZg6VxWhhneXJH+SmLFqPF0tdQ4+VY7ANZnfxkbk0cOlr/8Pm9m6OnP/5rQAAAAASUVORK5CYII=" />
      <header className="App-header">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          type="date"
          label="NFT Purchase Date"
          value={purchaseDate}
          format="YYYY-MM-DD"
          onChange={(newValue) => {
            applyNewDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
        <span className="form">
        <FormControl fullWidth>
          <InputLabel required id="demo-simple-select-label">Coin</InputLabel>
          <Select
            id="select-crypto"
            value={coin}
            label="Coin"
            onChange={handleCoinChange}
          >
            <MenuItem value={"ETH"}>Ethereum</MenuItem>
            <MenuItem value={"SOL"}>Solana</MenuItem>
            </Select>
        </FormControl>
        </span>
        <span className="amount">
          <TextField 
            type="number" 
            label={"Amount"}
            onChange={handleAmountChange}
            required />
        </span>
        <Button size="small" variant="contained" onClick={handleSubsmit}>Get Cost <br /> Basist</Button>
      </header>
      <div className="result">
        {`Estimated Cost Basis: $${costBasis*amount}`}
        </div>
    </div>
  );
}

export default App;
